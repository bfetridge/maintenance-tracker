import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const { ticketId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, units(unit_number, buildings(name, address))')
    .eq('id', ticketId)
    .single()

  if (!ticket) return new Response('Ticket not found', { status: 404, headers: corsHeaders })

  const landlordEmail = Deno.env.get('LANDLORD_EMAIL')!
  const appUrl = Deno.env.get('APP_URL')!
  const resendKey = Deno.env.get('RESEND_API_KEY')!

  const emergencyBadge = ticket.is_emergency ? '🚨 EMERGENCY — ' : ''
  const building = ticket.units?.buildings?.name ?? 'Unknown Building'
  const unit = ticket.units?.unit_number ?? 'Unknown Unit'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Maintenance Tracker <notifications@yourdomain.com>',
      to: landlordEmail,
      subject: `${emergencyBadge}New Maintenance Request — ${building}, ${unit}`,
      html: `
        <h2>${emergencyBadge}New Maintenance Request</h2>
        <p><strong>Building:</strong> ${building}</p>
        <p><strong>Unit:</strong> ${unit}</p>
        <p><strong>Tenant:</strong> ${ticket.tenant_name} (${ticket.tenant_email})</p>
        <p><strong>Category:</strong> ${ticket.category}</p>
        <p><strong>Description:</strong><br>${ticket.description}</p>
        <p><strong>Emergency:</strong> ${ticket.is_emergency ? 'YES' : 'No'}</p>
        <br>
        <a href="${appUrl}/dashboard" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          View Dashboard
        </a>
      `,
    }),
  })

  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
