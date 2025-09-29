export const WHATSAPP_PHONE = "+593987632921"; // TODO: replace with your number

export function buildWhatsAppLink(productName: string) {
  const text = encodeURIComponent(`Hola! Me interesa el diseño "${productName}" de CaseWave. ¿Me pasas info?`);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

export function buildCartWhatsAppLink(items: { name: string; qty: number; price: number }[], subtotal: number) {
  if (!items.length) return buildWhatsAppLink("");
  const lines = [
    "Hola! Quiero comprar estos diseños de CaseWave:",
    ...items.map(
      (i) => `• ${i.name} x${i.qty} = $${(i.price * i.qty).toFixed(2)}`
    ),
    `Total: $${subtotal.toFixed(2)}`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}
