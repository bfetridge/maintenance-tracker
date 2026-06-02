import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  received: 'Received — we have your request',
  in_progress: 'Working On It',
  resolved: 'Resolved',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const { ticketId, status, note } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, units(unit_number, buildings(name))')
    .eq('id', ticketId)
    .single()

  if (!ticket) return new Response('Ticket not found', { status: 404, headers: corsHeaders })

  const appUrl = Deno.env.get('APP_URL')!
  const resendKey = Deno.env.get('RESEND_API_KEY')!

  const statusLabel = STATUS_LABELS[status] ?? status

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Maintenance Tracker <notifications@yourdomain.com>',
      to: ticket.tenant_email,
      subject: `Update on your maintenance request — ${statusLabel}`,
      html: `
        <h2>Hi ${ticket.tenant_name},</h2>
        <p>Your maintenance request has been updated.</p>
        <p><strong>New Status:</strong> ${statusLabel}</p>
        ${note ? `<p><strong>Message from your landlord:</strong><br>${note}</p>` : ''}
        <br>
        <a href="${appUrl}/track/${ticketId}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Track Your Request
        </a>
      `,
    }),
  })

  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
