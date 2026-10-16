# WhatsApp click-to-chat implementation

The demo uses WhatsApp's documented click-to-chat format:

`https://wa.me/<international-number>?text=<url-encoded-message>`

The official WhatsApp target is stored privately in the frontend constant `DEMO_WHATSAPP_NUMBER` in international format. It is not rendered as visible website text; users reach it only through WhatsApp contact/order actions.

Checkout submits no server request and collects no payment. It builds a URL-encoded message containing the selected products, customer name, customer WhatsApp number, city, delivery address, optional notes, and estimated total, then redirects to WhatsApp.

References:

- https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/
- https://faq.whatsapp.com/5913398998672934
- https://www.kommo.com/whatsapp-link-generator/
