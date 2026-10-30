<script setup lang="ts">
const title = 'Contact | Ethan Baumann, développeur à Lyon'
const description = 'Parlons de votre projet web ou logiciel. Contactez Ethan Baumann, développeur à Lyon.'

useHead({
  htmlAttrs: { lang: 'fr' },
  title,
  link: [{ rel: 'canonical', href: 'https://ethanbaumann.fr/contact' }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: 'https://ethanbaumann.fr/contact' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary' }
  ]
})

const form = reactive({ name: '', email: '', message: '', website: '' })
const sending = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  if (sending.value) return
  sending.value = true
  sent.value = false
  error.value = ''

  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form }, retry: 0 })
    sent.value = true
    Object.assign(form, { name: '', email: '', message: '', website: '' })
  } catch (cause) {
    const status = (cause as { statusCode?: number }).statusCode
    error.value = status === 429
      ? 'Trop de tentatives. Réessayez dans 10 minutes ou contactez-moi par e-mail.'
      : status === 400
        ? 'Vérifiez votre nom, votre adresse e-mail et votre message.'
        : 'L’envoi n’a pas pu être confirmé. Votre texte est conservé : réessayez ou contactez-moi par e-mail.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <main class="contact-page" aria-labelledby="contact-title">
    <div class="contact-intro">
      <p class="contact-command" aria-hidden="true"><span>~</span> mail ethan</p>
      <h1 id="contact-title">Parlons de votre projet</h1>
      <p>Un site web, une application ou une idée à concrétiser ? Présentez-moi votre projet et vos besoins.</p>
      <a class="email-link" href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a>
      <NuxtLink class="back-link" to="/">← Retour à l’accueil</NuxtLink>
    </div>

    <div class="contact-form-container">
      <noscript><p>Pour utiliser le formulaire, activez JavaScript ou écrivez-moi directement à <a href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a>.</p></noscript>
      <form class="contact-form" action="/api/contact" method="post" :aria-busy="sending" @submit.prevent="submit">
        <p class="required-note">Tous les champs sont obligatoires.</p>
        <fieldset :disabled="sending">
          <legend class="sr-only">Vos coordonnées et votre projet</legend>
          <label for="contact-name">Nom</label>
          <input id="contact-name" v-model="form.name" name="name" autocomplete="name" required minlength="2" maxlength="100">

          <label for="contact-email">E-mail</label>
          <input id="contact-email" v-model="form.email" name="email" type="email" autocomplete="email" required maxlength="254">

          <label for="contact-message">Votre projet</label>
          <textarea id="contact-message" v-model="form.message" name="message" rows="7" required minlength="10" maxlength="5000" aria-describedby="message-hint" />
          <p id="message-hint" class="field-hint">Entre 10 et 5 000 caractères.</p>

          <div class="honeypot" aria-hidden="true" inert>
            <label for="contact-website">Site web</label>
            <input id="contact-website" v-model="form.website" name="website" tabindex="-1" autocomplete="off">
          </div>

          <p class="privacy-note">Vos coordonnées et votre message me sont transmis par e-mail pour répondre à votre demande.</p>
          <button type="submit">{{ sending ? 'Envoi en cours…' : 'Envoyer le message ↗' }}</button>
        </fieldset>
        <p class="form-status" role="status">{{ sent ? 'Merci ! Votre message a bien été envoyé.' : '' }}</p>
        <p v-if="error" class="form-error" role="alert">{{ error }} <a href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a></p>
      </form>
    </div>
  </main>
</template>

<style scoped>
.contact-page { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(40px, 7vw, 120px); padding-block: clamp(48px, 8vw, 110px); align-items: start; }
.contact-command { margin: 0 0 20px; font-size: 13px; color: #919191; }
.contact-command span { color: #11a8cd; }
h1 { margin: 0; font-size: clamp(28px, 3.5vw, 48px); line-height: 1.2; font-weight: 400; letter-spacing: -.04em; }
.contact-intro > p:not(.contact-command) { max-width: 40ch; margin: 24px 0; color: #b8b8b8; }
.email-link { display: inline-block; overflow-wrap: anywhere; }
.back-link { display: block; width: fit-content; margin-top: 40px; color: #919191; font-size: 13px; }
.contact-form-container { min-width: 0; }
.contact-form { position: relative; }
.required-note, .field-hint, .privacy-note { margin: 0 0 24px; font-size: 12px; color: #a3a3a3; }
fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
label { display: block; margin-bottom: 10px; font-size: 14px; }
input, textarea { display: block; box-sizing: border-box; width: 100%; min-width: 0; margin-bottom: 24px; padding: 12px; border: 1px solid #555; border-radius: 0; background: #090909; color: white; font: inherit; font-size: 16px; }
textarea { resize: vertical; }
.field-hint { margin-top: -12px; }
.privacy-note { line-height: 1.6; }
button { min-height: 44px; padding: 12px 18px; border: 1px solid white; background: white; color: black; cursor: pointer; font: inherit; font-size: 14px; }
button:hover { background: #d4d4d4; }
fieldset:disabled { opacity: .65; }
fieldset:disabled button { cursor: wait; }
.form-status, .form-error { margin: 20px 0 0; font-size: 14px; overflow-wrap: anywhere; }
.form-status:empty { margin: 0; }
.form-error { color: #ffb4ab; }
.form-error a, noscript a { text-decoration: underline; }
.honeypot { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 700px) {
  .contact-page { grid-template-columns: minmax(0, 1fr); }
  button { width: 100%; }
}
</style>
