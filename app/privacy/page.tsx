import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SoulMap",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-10 pb-16">
      <div>
        <p className="label">Legal</p>
        <h1 className="heading text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-ink-soft">Last updated: June 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="heading text-xl">The short version</h2>
        <p className="text-ink-soft leading-relaxed">
          SoulMap is a private journaling tool. Your entries stay on your device
          by default. When you sign in, they sync to a private cloud database
          tied to your account. When you request AI reflection, the relevant
          content is sent to Anthropic to generate a response — we don&apos;t
          store it there. We don&apos;t sell data, run ads, or share your
          writing with anyone.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="heading text-xl">What we collect and why</h2>

        <div className="card space-y-2 p-5">
          <p className="font-medium text-ink">Account information</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            When you sign in, Clerk (our authentication provider) collects your
            email address and any name or profile picture you provide. This is
            required to identify your account and sync your data across devices.
          </p>
        </div>

        <div className="card space-y-2 p-5">
          <p className="font-medium text-ink">Journal entries, values, and Ikigai responses</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            Everything you write is stored locally in your browser (IndexedDB)
            first. If you&apos;re signed in, it is also saved to a private
            cloud database (Neon Postgres) so it persists across devices. Your
            content is never shared with third parties except as described below.
          </p>
        </div>

        <div className="card space-y-2 p-5">
          <p className="font-medium text-ink">AI-generated reflections</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            When you request a reflection, your journal entry, selected values,
            or Ikigai inputs are sent to Anthropic&apos;s API (Claude) to
            generate a response. Anthropic processes this content under their
            own{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-dark underline"
            >
              privacy policy
            </a>
            . We do not store your content with Anthropic beyond the duration
            of the API call. AI reflections are optional — you can journal
            without ever requesting one.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="heading text-xl">Third-party services</h2>
        <ul className="space-y-2 text-ink-soft leading-relaxed">
          <li>
            <span className="font-medium text-ink">Clerk</span> — authentication
            and account management.{" "}
            <a
              href="https://clerk.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-dark underline"
            >
              Their privacy policy.
            </a>
          </li>
          <li>
            <span className="font-medium text-ink">Anthropic</span> — AI
            processing of content you submit for reflection.{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-dark underline"
            >
              Their privacy policy.
            </a>
          </li>
          <li>
            <span className="font-medium text-ink">Neon</span> — cloud database
            for signed-in users. Data is stored in a private database tied to
            your account only.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="heading text-xl">What we don&apos;t do</h2>
        <ul className="space-y-1 text-ink-soft leading-relaxed list-disc list-inside">
          <li>Sell or share your data with advertisers</li>
          <li>Run behavioral tracking or third-party analytics</li>
          <li>Read your journal entries ourselves</li>
          <li>Use your writing to train AI models</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="heading text-xl">Your data, your control</h2>
        <p className="text-ink-soft leading-relaxed">
          Local data (IndexedDB) lives in your browser and can be cleared at
          any time through your browser settings. To delete your account and
          cloud data, contact us at the address below and we will remove it
          within 30 days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="heading text-xl">Contact</h2>
        <p className="text-ink-soft leading-relaxed">
          Questions or deletion requests:{" "}
          <a
            href="mailto:manojharpalani@gmail.com"
            className="text-sage-dark underline"
          >
            manojharpalani@gmail.com
          </a>
        </p>
      </section>

      <div className="pt-4">
        <Link href="/" className="label text-sage-dark hover:underline">
          ← Back to SoulMap
        </Link>
      </div>
    </div>
  );
}
