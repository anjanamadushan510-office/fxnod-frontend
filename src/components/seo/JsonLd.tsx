/**
 * A schema.org block for search engines and AI crawlers.
 *
 * It is a data block, not a script the browser runs, so the nonce-based
 * script-src in middleware.ts does not apply to it. `<` is escaped because
 * blog titles and excerpts reach this from the database: a value containing
 * `</script>` must not be able to close the element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
