import { Link } from "react-router";
import {
  Key,
  Globe,
  BarChart3,
  Keyboard,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Trash2,
  RefreshCw,
  Zap,
} from "lucide-react";

function PageLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="font-semibold text-accent-blue hover:underline underline-offset-2 decoration-accent-blue/40 transition-colors"
    >
      {children}
    </Link>
  );
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "quickstart",
    title: "Quick Start",
    icon: <Zap size={16} className="text-accent-blue" />,
    content: (
      <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
        <p>
          Get a mock API endpoint running in under 60 seconds:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-text-primary">
          <li>Go to <PageLink to="/dashboard/mocks">Mocks</PageLink> and click <strong>"Create Mock"</strong></li>
          <li>Enter a name (e.g., "Products API") and path (e.g., <code className="font-mono text-[12px] text-accent-blue">products</code>)</li>
          <li>Select the HTTP methods you want (GET, POST, PUT, DELETE)</li>
          <li>Click <strong>Create</strong></li>
          <li>Go to <PageLink to="/dashboard/api-keys">API Keys</PageLink> and generate a key</li>
          <li>Copy the key and use it in your requests</li>
        </ol>
        <div className="mt-3 rounded-none border border-border bg-bg-terminal p-3">
          <p className="text-[12px] text-text-muted mb-1">Example request:</p>
          <code className="font-mono text-[12px] text-accent-blue">
            curl -H "Authorization: Bearer m3_live_xxx" http://localhost:3001/mocks/products
          </code>
        </div>
      </div>
    ),
  },
  {
    id: "mocks",
    title: "Creating Mocks",
    icon: <Globe size={16} className="text-emerald-400" />,
    content: (
      <div className="space-y-4 text-[13px] text-text-secondary leading-relaxed">
        <p>
          Mocks are your virtual API endpoints. Each mock has a unique path and can respond differently to each HTTP method.
        </p>
         <picture>
           <source type="image/webp" srcSet="/screenshots/mock-create-dialog.webp" />
           <img
             src="/screenshots/mock-create-dialog.png"
             alt="Create Mock dialog showing Name, Path, and Methods fields"
             className="w-full rounded-none border border-border"
           />
         </picture>
        <div className="rounded-none border border-border bg-bg-terminal p-3 space-y-2">
          <p className="text-[12px] text-text-muted">Mock fields:</p>
          <ul className="space-y-1">
            <li><strong className="text-text-primary">Name</strong> — Display name for identification</li>
            <li><strong className="text-text-primary">Path</strong> — URL path (e.g., <code className="font-mono text-[12px]">users</code> or <code className="font-mono text-[12px]">users/:id</code>)</li>
            <li><strong className="text-text-primary">Methods</strong> — Which HTTP methods to enable</li>
          </ul>
        </div>
        <p>
          After creating, you'll see the detail view where you configure each method independently:
        </p>
         <picture>
           <source type="image/webp" srcSet="/screenshots/mock-detail.webp" />
           <img
             src="/screenshots/mock-detail.png"
             alt="Mock detail view with method configuration"
             className="w-full rounded-none border border-border"
           />
         </picture>
        <p>Each method (GET, POST, PUT, DELETE, PATCH) has its own configuration:</p>
        <ul className="space-y-1">
          <li><strong className="text-text-primary">Status code</strong> — HTTP response code (200, 201, 404, 500, etc.)</li>
          <li><strong className="text-text-primary">Headers</strong> — Custom response headers</li>
          <li><strong className="text-text-primary">Body</strong> — JSON payload with syntax highlighting</li>
        </ul>
        <div className="flex items-start gap-2 mt-2 rounded-none border border-amber-500/30 bg-amber-500/5 p-2">
          <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-amber-200/80">
            Free tier: 3 mocks max. Creating a 4th will be blocked.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "api-keys",
    title: "API Keys",
    icon: <Key size={16} className="text-violet-400" />,
    content: (
      <div className="space-y-4 text-[13px] text-text-secondary leading-relaxed">
        <p>
          API keys authenticate your requests to mock endpoints. Go to <PageLink to="/dashboard/api-keys">API Keys</PageLink> to manage them.
        </p>
         <picture>
           <source type="image/webp" srcSet="/screenshots/api-keys-list.webp" />
           <img
             src="/screenshots/api-keys-list.png"
             alt="API Keys list showing keys with status badges"
             className="w-full rounded-none border border-border"
           />
         </picture>
        <p>Click <strong className="text-text-primary">"Generate Key"</strong> to create a new key:</p>
         <picture>
           <source type="image/webp" srcSet="/screenshots/api-key-generate-dialog.webp" />
           <img
             src="/screenshots/api-key-generate-dialog.png"
             alt="Generate API Key dialog with name and expiration fields"
             className="w-full rounded-none border border-border"
           />
         </picture>
        <div className="rounded-none border border-border bg-bg-terminal p-3 space-y-2">
          <p className="text-[12px] text-text-muted">Key management:</p>
          <ul className="space-y-1">
            <li><strong className="text-text-primary">Generate</strong> — Create a new key with optional name and expiration</li>
            <li><strong className="text-text-primary">Regenerate</strong> — Revoke current key and create a new one (same name/TTL)</li>
            <li><strong className="text-text-primary">Delete</strong> — Soft-delete (deactivates the key)</li>
          </ul>
        </div>
         <picture>
           <source type="image/webp" srcSet="/screenshots/api-key-generated.webp" />
           <img
             src="/screenshots/api-key-generated.png"
             alt="Generated API key with copy button"
             className="w-full rounded-none border border-border"
           />
         </picture>
        <div className="flex items-start gap-2 mt-2 rounded-none border border-amber-500/30 bg-amber-500/5 p-2">
          <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-amber-200/80">
            The key is shown ONCE after generation. We can't show it again — copy it immediately.
          </p>
        </div>
        <p>
          Destructive actions (Regenerate, Delete) use a <strong className="text-text-primary">type-to-confirm</strong> pattern — you must type the exact key name to confirm.
        </p>
      </div>
    ),
  },
  {
    id: "usage",
    title: "Usage Dashboard",
    icon: <BarChart3 size={16} className="text-emerald-400" />,
    content: (
      <div className="space-y-4 text-[13px] text-text-secondary leading-relaxed">
        <p>
          The <PageLink to="/dashboard">Dashboard</PageLink> shows real-time usage data from your API calls.
        </p>
         <picture>
           <source type="image/webp" srcSet="/screenshots/dashboard.webp" />
           <img
             src="/screenshots/dashboard.png"
             alt="Dashboard showing usage stats, rate limit, and hourly chart"
             className="w-full rounded-none border border-border"
           />
         </picture>
        <div className="rounded-none border border-border bg-bg-terminal p-3 space-y-2">
          <p className="text-[12px] text-text-muted">Metrics displayed:</p>
          <ul className="space-y-1">
            <li><strong className="text-text-primary">Requests today</strong> — Total requests in the current day</li>
            <li><strong className="text-text-primary">Requests this hour</strong> — Requests in the rolling hour window</li>
            <li><strong className="text-text-primary">Hourly chart</strong> — Request distribution over the last 24 hours</li>
            <li><strong className="text-text-primary">Active keys</strong> — Number of active API keys</li>
            <li><strong className="text-text-primary">Mocks created</strong> — Number of mock endpoints (max 3 on free tier)</li>
          </ul>
        </div>
        <div className="flex items-start gap-2 mt-2 rounded-none border border-border bg-bg-terminal p-2">
          <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-emerald-200/80">
            Rate limit: 300 requests/hour per user (shared across all your API keys). The limit resets continuously as older requests expire.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    icon: <Keyboard size={16} className="text-cyan-400" />,
    content: (
      <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
        <p>
          Speed up your workflow with keyboard shortcuts:
        </p>
        <div className="rounded-none border border-border bg-bg-terminal p-3">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-1 text-left text-text-muted font-medium">Shortcut</th>
                <th className="py-1 text-left text-text-muted font-medium">Action</th>
                <th className="py-1 text-left text-text-muted font-medium">Where</th>
              </tr>
            </thead>
            <tbody className="text-text-primary">
              <tr className="border-b border-border/50">
                <td className="py-1.5"><kbd className="font-mono bg-bg-editor border border-border px-1.5 py-0.5">N</kbd></td>
                <td className="py-1.5">Create new mock</td>
                <td className="py-1.5"><PageLink to="/dashboard/mocks">Mocks</PageLink> page</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-1.5"><kbd className="font-mono bg-bg-editor border border-border px-1.5 py-0.5">/</kbd></td>
                <td className="py-1.5">Focus search bar</td>
                <td className="py-1.5"><PageLink to="/dashboard/mocks">Mocks</PageLink> page</td>
              </tr>
              <tr>
                <td className="py-1.5"><kbd className="font-mono bg-bg-editor border border-border px-1.5 py-0.5">Cmd+K</kbd></td>
                <td className="py-1.5">Open command palette</td>
                <td className="py-1.5">Anywhere</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-text-muted">
          Shortcuts are disabled when focus is in an input, textarea, or editable content.
        </p>
      </div>
    ),
  },
  {
    id: "tips",
    title: "Tips & Best Practices",
    icon: <CheckCircle2 size={16} className="text-emerald-400" />,
    content: (
      <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Copy size={14} className="text-text-muted mt-0.5 shrink-0" />
            <span><strong className="text-text-primary">Copy URLs from mock cards</strong> — Click the copy icon next to any mock's URL in the <PageLink to="/dashboard/mocks">Mocks</PageLink> page to get the full endpoint path.</span>
          </li>
          <li className="flex items-start gap-2">
            <RefreshCw size={14} className="text-text-muted mt-0.5 shrink-0" />
            <span><strong className="text-text-primary">Regenerate lost keys</strong> — If you lose an API key, regenerate it from the <PageLink to="/dashboard/api-keys">API Keys</PageLink> page. The old key is immediately invalidated.</span>
          </li>
          <li className="flex items-start gap-2">
            <Trash2 size={14} className="text-text-muted mt-0.5 shrink-0" />
            <span><strong className="text-text-primary">Soft-delete preserves data</strong> — Deleted mocks don't serve traffic but their request logs remain for usage analytics on the <PageLink to="/dashboard">Dashboard</PageLink>.</span>
          </li>
          <li className="flex items-start gap-2">
            <Key size={14} className="text-text-muted mt-0.5 shrink-0" />
            <span><strong className="text-text-primary">Name your keys</strong> — Give <PageLink to="/dashboard/api-keys">API keys</PageLink> descriptive names ("Local Dev", "CI Pipeline") to identify them later.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-text-muted mt-0.5 shrink-0" />
            <span><strong className="text-text-primary">Set expiration for temporary keys</strong> — Use the optional TTL (in hours) for keys that should auto-expire.</span>
          </li>
        </ul>
      </div>
    ),
  },
];

export default function HowToUse() {
  return (
    <div className="max-w-3xl">
      <div className="pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent-blue before:to-accent-blue/30 before:rounded-full relative">
        <h1 className="text-[24px] font-semibold text-text-primary">
          How to Use
        </h1>
        <p className="mt-1 text-[13px] text-text-secondary">
          Everything you need to create and manage mock API endpoints
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <div className="flex items-center gap-2">
              {section.icon}
              <h2 className="text-[16px] font-semibold text-text-primary">
                {section.title}
              </h2>
            </div>
            {section.content}
          </section>
        ))}
      </div>
    </div>
  );
}
