/**
 * DOCX Editor Demo
 *
 * Complete demo showing all features:
 * - Load sample or custom DOCX
 * - Full editing with toolbar
 * - Context menu AI (mock handler)
 * - Save/download
 * - Variable panel
 *
 * Routes:
 * - / - Default editor demo
 * - /docxtemplater - Template plugin demo
 */

import './styles.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  DocxEditor,
  type DocxEditorRef,
  createEmptyDocument,
  type Document,
  PluginHost,
  templatePlugin,
} from '../src/index';

// ============================================================================
// SHARED STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: '#f8fafc',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
    color: '#0f172a',
    letterSpacing: '-0.025em',
  },
  titleLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  fileName: {
    fontSize: '13px',
    color: '#475569',
    padding: '4px 10px',
    background: '#f1f5f9',
    borderRadius: '6px',
  },
  badge: {
    fontSize: '11px',
    color: '#fff',
    padding: '3px 8px',
    background: '#3b82f6',
    borderRadius: '4px',
    fontWeight: 500,
  },
  fileInputLabel: {
    padding: '8px 14px',
    background: '#0f172a',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background 0.15s',
  },
  fileInputHidden: {
    display: 'none',
  },
  button: {
    padding: '8px 14px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: '#334155',
    transition: 'all 0.15s',
  },
  newButton: {
    padding: '8px 14px',
    background: '#f1f5f9',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  navLink: {
    padding: '6px 12px',
    fontSize: '13px',
    color: '#64748b',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'all 0.15s',
  },
  navLinkActive: {
    padding: '6px 12px',
    fontSize: '13px',
    color: '#2563eb',
    textDecoration: 'none',
    background: '#eff6ff',
    borderRadius: '4px',
    fontWeight: 500,
  },
  status: {
    fontSize: '12px',
    color: '#64748b',
    padding: '4px 8px',
    background: '#f1f5f9',
    borderRadius: '4px',
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
};

// ============================================================================
// SAMPLE TEMPLATE DOCUMENT
// ============================================================================

function createTemplateDocument(): Document {
  const doc = createEmptyDocument();
  const body = doc.package.document;

  // Add template content to the first paragraph
  if (body.content.length > 0 && body.content[0].type === 'paragraph') {
    body.content[0].content = [
      {
        type: 'run',
        content: [{ type: 'text', text: 'Dear {name},' }],
      },
    ];
  }

  // Add more paragraphs with template syntax
  body.content.push(
    {
      type: 'paragraph',
      content: [],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [
            {
              type: 'text',
              text: 'Thank you for your order. Here are your items:',
            },
          ],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: '{#items}' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [
            {
              type: 'text',
              text: '  • {items.name} - ${items.price} x {items.quantity}',
            },
          ],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: '{/items}' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: '{#hasDiscount}' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: 'Discount applied: {discountPercent}%' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: '{/hasDiscount}' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: 'Total: ${total}' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: 'Best regards,' }],
        },
      ],
      formatting: {},
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'run',
          content: [{ type: 'text', text: '{company.name}' }],
        },
      ],
      formatting: {},
    }
  );

  return doc;
}

// ============================================================================
// SHARED EDITOR WRAPPER
// ============================================================================

interface EditorWrapperProps {
  editorRef: React.RefObject<DocxEditorRef | null>;
  currentDocument: Document | null;
  documentBuffer: ArrayBuffer | null;
  onDocumentChange: (doc: Document) => void;
  onError: (error: Error) => void;
  onFontsLoaded: () => void;
  withTemplatePlugin?: boolean;
}

function EditorWrapper({
  editorRef,
  currentDocument,
  documentBuffer,
  onDocumentChange,
  onError,
  onFontsLoaded,
  withTemplatePlugin = false,
}: EditorWrapperProps) {
  const editor = (
    <DocxEditor
      ref={editorRef}
      document={documentBuffer ? undefined : currentDocument}
      documentBuffer={documentBuffer}
      onChange={onDocumentChange}
      onError={onError}
      onFontsLoaded={onFontsLoaded}
      showToolbar={true}
      showRuler={true}
      showVariablePanel={false}
      showZoomControl={true}
      showPageNumbers={false}
      initialZoom={1.0}
      variablePanelPosition="right"
    />
  );

  if (withTemplatePlugin) {
    return <PluginHost plugins={[templatePlugin]}>{editor}</PluginHost>;
  }

  return editor;
}

// ============================================================================
// BASE DEMO APP (shared logic)
// ============================================================================

interface BaseDemoProps {
  title: string;
  badge?: string;
  withTemplatePlugin?: boolean;
  initialDocument?: Document | null;
}

function BaseDemo({ title, badge, withTemplatePlugin = false, initialDocument }: BaseDemoProps) {
  const editorRef = useRef<DocxEditorRef>(null);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(
    () => initialDocument ?? createEmptyDocument()
  );
  const [documentBuffer, setDocumentBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('Untitled.docx');
  const [status, setStatus] = useState<string>('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listen for route changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle new document
  const handleNewDocument = useCallback(() => {
    setCurrentDocument(withTemplatePlugin ? createTemplateDocument() : createEmptyDocument());
    setDocumentBuffer(null);
    setFileName(withTemplatePlugin ? 'template.docx' : 'Untitled.docx');
    setStatus('');
  }, [withTemplatePlugin]);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus('Loading...');
      const buffer = await file.arrayBuffer();
      setCurrentDocument(null);
      setDocumentBuffer(buffer);
      setFileName(file.name);
      setStatus('');
    } catch (error) {
      setStatus('Error loading file');
      console.error('Failed to load file:', error);
    }
  }, []);

  // Handle save/download
  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      setStatus('Saving...');
      const buffer = await editorRef.current.save();
      if (buffer) {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'document.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus('Saved!');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch (error) {
      setStatus('Save failed');
      console.error('Failed to save:', error);
    }
  }, [fileName]);

  const handleDocumentChange = useCallback((_doc: Document) => {
    // no-op (disable noisy logging)
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Editor error:', error);
    setStatus(`Error: ${error.message}`);
  }, []);

  const handleFontsLoaded = useCallback(() => {
    console.log('Fonts loaded');
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <a
            href="https://github.com/eigenpal/docx-js-editor"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.titleLink}
          >
            <h1 style={styles.title}>{title}</h1>
          </a>
          {badge && <span style={styles.badge}>{badge}</span>}
          {fileName && <span style={styles.fileName}>{fileName}</span>}
        </div>
        <div style={styles.headerRight}>
          {/* Navigation */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            style={currentPath === '/' ? styles.navLinkActive : styles.navLink}
          >
            Editor
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate('/about');
            }}
            style={currentPath === '/about' ? styles.navLinkActive : styles.navLink}
          >
            About
          </a>
          <span style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
          <label style={styles.fileInputLabel}>
            <input
              type="file"
              accept=".docx"
              onChange={handleFileSelect}
              style={styles.fileInputHidden}
            />
            Open DOCX
          </label>
          <button style={styles.newButton} onClick={handleNewDocument}>
            New
          </button>
          <button style={styles.button} onClick={handleSave}>
            Save
          </button>
          {status && <span style={styles.status}>{status}</span>}
        </div>
      </header>

      <main style={styles.main}>
        <EditorWrapper
          editorRef={editorRef}
          currentDocument={currentDocument}
          documentBuffer={documentBuffer}
          onDocumentChange={handleDocumentChange}
          onError={handleError}
          onFontsLoaded={handleFontsLoaded}
          withTemplatePlugin={withTemplatePlugin}
        />
      </main>
    </div>
  );
}

// ============================================================================
// ABOUT PAGE
// ============================================================================

function AboutPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            style={styles.titleLink}
          >
            <h1 style={styles.title}>docx-editor.com</h1>
          </a>
        </div>
        <div style={styles.headerRight}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            style={styles.navLink}
          >
            Editor
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate('/about');
            }}
            style={styles.navLinkActive}
          >
            About
          </a>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '60px 20px',
        }}
      >
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '12px',
              letterSpacing: '-0.025em',
            }}
          >
            Edit DOCX files. No login required.
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', lineHeight: 1.7, marginBottom: '40px' }}>
            docx-editor.com is a free, browser-based DOCX editor. Open a file, make your changes,
            and download — that's it.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3
                style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}
              >
                100% local
              </h3>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
                Your documents never leave your browser. Everything runs locally on your device — no
                uploads, no servers, no cloud storage.
              </p>
            </div>

            <div>
              <h3
                style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}
              >
                We don't save your data
              </h3>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
                We have no database, no user accounts, and no analytics tracking your documents.
                When you close the tab, your data is gone from our end — because it was never there.
              </p>
            </div>

            <div>
              <h3
                style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}
              >
                No sign-up, no paywall
              </h3>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
                Just open the site and start editing. No account creation, no email verification, no
                trial period.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '48px' }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#0f172a',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Open the editor
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// ROUTER
// ============================================================================

function navigate(to: string) {
  window.history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function Router() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (path === '/about') {
    return <AboutPage />;
  }

  return <BaseDemo title="docx-editor.com" />;
}

// ============================================================================
// MOUNT
// ============================================================================

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Router />);
}
