export type ToolKind = "free" | "paid";

export interface FxnodTool {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  kind: ToolKind;
  /** Where the tool opens, once it has been activated. */
  href?: string;
  price?: string;
  /**
   * Text-only compatibility labels. Never an exchange logo: the badge is
   * our own wording so the marketplace stays clear of trademark marks.
   */
  badges: string[];
}
