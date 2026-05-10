/*
 * TypeDoc-Markdown → structured `ApiModule`.
 *
 * The grammar produced by `typedoc-plugin-markdown` (with our config) is
 * regular enough for hand-written parsing to be both clearer and faster
 * than pulling in a full Markdown parser:
 *
 *   # <module-name>            (H1)
 *   ## <Section>               (H2 — Interfaces, Type Aliases, Functions, …)
 *   ### <MemberName>           (H3 — one per declared member)
 *   > **Name**: signature      (declaration, in a blockquote)
 *   Defined in: [path:line](url)
 *   <description prose>
 *   #### <Sub-section>         (H4 — Properties, Parameters, Returns, …)
 *   ##### <prop-name>          (H5 — one per property/parameter)
 *   > <signature>
 *   Defined in: [path:line](url)
 *   ***                        (member separator)
 */

import type {
  ApiMember,
  ApiModule,
  ApiPackageId,
  ApiProperty,
  ApiSource,
  ApiTypeParameter,
  MemberKind,
} from './types.js';

const SECTION_KIND_MAP: Record<string, MemberKind> = {
  Interfaces: 'interface',
  Classes: 'class',
  'Type Aliases': 'type-alias',
  Functions: 'function',
  Enumerations: 'enum',
  Variables: 'variable',
  Namespaces: 'namespace',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseSourceLink(line: string): ApiSource | undefined {
  const m = line.match(/Defined in:\s*\[([^\]]+):(\d+)\]\(([^)]+)\)/);
  if (!m) return undefined;
  return { file: m[1] as string, line: Number(m[2]), url: m[3] as string };
}

interface H2Section {
  h2: string;
  body: string;
}

function splitTop(md: string): { h1: string; sections: H2Section[] } {
  const lines = md.split('\n');
  let h1 = '';
  const sections: H2Section[] = [];
  let cur: { h2: string; body: string[] } | null = null;
  for (const line of lines) {
    if (!h1 && line.startsWith('# ')) {
      h1 = line.slice(2).trim();
      continue;
    }
    if (line.startsWith('## ')) {
      if (cur) sections.push({ h2: cur.h2, body: cur.body.join('\n') });
      cur = { h2: line.slice(3).trim(), body: [] };
      continue;
    }
    if (cur) cur.body.push(line);
  }
  if (cur) sections.push({ h2: cur.h2, body: cur.body.join('\n') });
  return { h1, sections };
}

interface RawMember {
  name: string;
  body: string;
}

function splitMembers(body: string): RawMember[] {
  const out: RawMember[] = [];
  const lines = body.split('\n');
  let cur: { name: string; body: string[] } | null = null;
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (cur) out.push({ name: cur.name, body: cur.body.join('\n') });
      cur = { name: line.slice(4).trim(), body: [] };
    } else if (line.trim() === '***') {
      if (cur) {
        out.push({ name: cur.name, body: cur.body.join('\n') });
        cur = null;
      }
    } else if (cur) {
      cur.body.push(line);
    }
  }
  if (cur) out.push({ name: cur.name, body: cur.body.join('\n') });
  return out;
}

interface H4 {
  h4: string;
  body: string;
}

function parseSubSections(body: string): { intro: string; subs: H4[] } {
  const lines = body.split('\n');
  const intro: string[] = [];
  const subs: { h4: string; body: string[] }[] = [];
  let cur: { h4: string; body: string[] } | null = null;
  for (const line of lines) {
    if (line.startsWith('#### ')) {
      if (cur) subs.push(cur);
      cur = { h4: line.slice(5).trim(), body: [] };
    } else if (cur) {
      cur.body.push(line);
    } else {
      intro.push(line);
    }
  }
  if (cur) subs.push(cur);
  return {
    intro: intro.join('\n').trim(),
    subs: subs.map((s) => ({ h4: s.h4, body: s.body.join('\n').trim() })),
  };
}

function parseH5Block(body: string): ApiProperty[] {
  const lines = body.split('\n');
  const blocks: { name: string; lines: string[] }[] = [];
  let cur: { name: string; lines: string[] } | null = null;
  for (const line of lines) {
    if (line.startsWith('##### ')) {
      if (cur) blocks.push(cur);
      cur = { name: line.slice(6).trim(), lines: [] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) blocks.push(cur);

  return blocks.map((b) => {
    const ls = b.lines.join('\n').trim().split('\n');
    let signature = '';
    let source: ApiSource | undefined;
    const descLines: string[] = [];
    for (const l of ls) {
      if (l.startsWith('> ')) {
        signature = signature ? `${signature}\n${l.slice(2)}` : l.slice(2);
      } else if (l.startsWith('Defined in:')) {
        source = parseSourceLink(l);
      } else {
        descLines.push(l);
      }
    }
    const optional = b.name.endsWith('?');
    const cleanName = b.name.replace(/\?$/, '');
    return {
      name: cleanName,
      optional,
      signature: signature.trim(),
      description:
        descLines
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim() || undefined,
      source,
    };
  });
}

function parseMember(kind: MemberKind, raw: RawMember): ApiMember {
  const cleanName = raw.name.replace(/\(\)$/, '');
  const slug = slugify(cleanName);
  const { intro, subs } = parseSubSections(raw.body);

  let signature = '';
  let source: ApiSource | undefined;
  const descLines: string[] = [];
  for (const l of intro.split('\n')) {
    if (l.startsWith('> ')) {
      signature = signature ? `${signature}\n${l.slice(2)}` : l.slice(2);
    } else if (l.startsWith('Defined in:')) {
      source = parseSourceLink(l);
    } else {
      descLines.push(l);
    }
  }

  const member: ApiMember = {
    kind,
    name: cleanName,
    slug,
    signature: signature.trim() || undefined,
    description:
      descLines
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim() || undefined,
    source,
  };

  const tags: { name: string; text: string }[] = [];

  for (const sub of subs) {
    switch (sub.h4) {
      case 'Properties':
        member.properties = parseH5Block(sub.body);
        break;
      case 'Methods':
        // Treat methods inside an interface as additional properties — they
        // share the same H5 block shape and the UI renders them identically.
        member.properties = (member.properties ?? []).concat(parseH5Block(sub.body));
        break;
      case 'Parameters':
        member.parameters = parseH5Block(sub.body).map((p) => ({
          name: p.name,
          optional: p.optional,
          type: p.signature || p.description || '',
          description: p.signature ? p.description : undefined,
        }));
        break;
      case 'Returns':
        member.returns = { type: sub.body };
        break;
      case 'Type Parameters':
        member.typeParameters = parseH5Block(sub.body).map<ApiTypeParameter>((p) => ({
          name: p.name,
          constraint: p.signature,
        }));
        break;
      default:
        tags.push({ name: sub.h4, text: sub.body });
    }
  }

  if (tags.length > 0) member.tags = tags;
  return member;
}

export function parseModule(args: {
  slug: string;
  name: string;
  fullName: string;
  packageId: ApiPackageId;
  markdown: string;
}): ApiModule {
  const { slug, name, fullName, packageId, markdown } = args;
  const { sections } = splitTop(markdown);
  const members: ApiMember[] = [];
  for (const section of sections) {
    const kind = SECTION_KIND_MAP[section.h2];
    if (!kind) continue;
    for (const raw of splitMembers(section.body)) {
      members.push(parseMember(kind, raw));
    }
  }
  return { slug, name, fullName, packageId, members };
}

/**
 * Cheap pre-pass that only counts members per kind. Used by the index page
 * so we can show member counts without paying the full-parse cost for
 * every module up-front.
 */
export function quickScan(markdown: string): { kindCounts: Partial<Record<MemberKind, number>> } {
  const { sections } = splitTop(markdown);
  const counts: Partial<Record<MemberKind, number>> = {};
  for (const s of sections) {
    const kind = SECTION_KIND_MAP[s.h2];
    if (!kind) continue;
    const n = s.body.split('\n').filter((l) => l.startsWith('### ')).length;
    counts[kind] = (counts[kind] ?? 0) + n;
  }
  return { kindCounts: counts };
}
