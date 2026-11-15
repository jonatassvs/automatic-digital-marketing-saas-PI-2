const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.join(__dirname, '..', name.slice(2)) : name, ...args);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
}
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const { normalizeProps } = require('../renderer/normalizeProps.ts');
const { validateComponentTree } = require('../renderer/validation.ts');
const { componentSchemas } = require('../renderer/schemas/componentSchemas.ts');
const { TextBlock } = require('../components/base/TextBlock/TextBlock.tsx');
const { ImageBlock } = require('../components/base/ImageBlock/ImageBlock.tsx');
const { ButtonBlock } = require('../components/base/ButtonBlock/ButtonBlock.tsx');
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
assert.match(render(TextBlock, { fontSizeMobile: 24, fontSizeDesktop: 48, useDesktopFontSize: true }), /--text-font-size-desktop:3rem;--text-font-size-mobile:1.5rem/);
assert.match(render(TextBlock, { fontSizeMobile: 20, fontSizeDesktop: 48 }), /--text-font-size-desktop:1.25rem/);
const imageProps = normalizeProps(componentSchemas.Image, { src: '/photo.jpg', alt: 'Photo', width: 300, height: 200, objectFit: 'contain', objectPositionX: 20 });
const image = render(ImageBlock, imageProps);
assert.match(image, /width:300px/); assert.match(image, /height:200px/); assert.match(image, /object-fit:contain/); assert.match(image, /object-position:20% 50%/);
assert.match(render(ImageBlock, { src: '/photo.jpg', aspectRatio: 'auto' }), /aspect-ratio:auto/);
const button = render(ButtonBlock, normalizeProps(componentSchemas.Button, { customColors: true, backgroundColor: '#123456', hoverColor: '#abcdef', newTab: true, fontSize: 24 }));
assert.match(button, /--button-background:#123456/); assert.match(button, /--button-hover-color:#abcdef/); assert.match(button, /font-size:1.5rem/); assert.match(button, /rel="noopener noreferrer"/);
assert.match(render(ButtonBlock, { variant: 'secondary' }), /--button-background:#e5e7eb/);
for (const props of [{ width: -1 }, { height: Infinity }, { objectFit: 'invalid' }, { opacity: 101 }, { borderColor: 'url(https://example.com)' }, { src: 'java\nscript:alert(1)' }]) {
  assert.equal(validateComponentTree([{ id: 'image', component: 'Image', props: { src: '/photo.jpg', alt: 'Photo', ...props } }]).valid, false);
}
assert.equal(normalizeProps(componentSchemas.Image, { width: -1 }).width, 0);
assert.equal(validateComponentTree([{ id: 'image', component: 'Image', props: imageProps }]).valid, true);
console.log('Component rendering and validation checks passed.');

const { responsiveStyle } = require('../components/base/responsiveStyle.ts');
const { ComponentRenderer } = require('../renderer/ComponentRenderer.tsx');
const { componentRegistry } = require('../renderer/componentRegistry.tsx');
const { basicStyleFields, responsiveFieldName } = require('../renderer/schemas/responsiveStyles.ts');
const shared = responsiveStyle({ paddingInline: 24, opacity: 0.7 }, { desktopPaddingLeft: 48, desktopOpacity: 50 });
assert.equal(shared['--r-mobile-paddingLeft'], '24px');
assert.equal(shared['--r-desktop-paddingLeft'], '48px');
assert.equal(shared['--r-mobile-opacity'], 0.7);
assert.equal(shared['--r-desktop-opacity'], 0.5);
assert.equal(responsiveStyle({}, { mobileMarginTop: 0 })['--r-mobile-marginTop'], '0px');
assert.equal(responsiveStyle({}, { mobilePaddingTop: -2 }).paddingTop, undefined);
assert.deepEqual(responsiveStyle({ padding: 20 }, {}), { padding: 20 });
const inherited = responsiveStyle({}, { mobilePaddingTop: 12 });
assert.equal(inherited['--r-desktop-paddingTop'], 'var(--r-mobile-paddingTop)');
for (const [name, schema] of Object.entries(componentSchemas)) {
  for (const field of basicStyleFields) {
    for (const device of ['mobile', 'desktop']) {
      assert.ok(schema.fields.some(candidate => candidate.name === responsiveFieldName(device, field.name)));
    }
  }
  const props = normalizeProps(schema, { mobilePaddingTop: 12, desktopPaddingTop: 40, mobileBackgroundColor: '#abcdef' });
  const markup = render(componentRegistry[name], { ...props, responsiveProps: props });
  assert.match(markup, /responsive-component/);
  assert.match(markup, /--r-mobile-paddingTop:12px/);
  assert.match(markup, /--r-desktop-paddingTop:40px/);
  assert.match(markup, /--r-mobile-backgroundColor:#abcdef/);
  assert.equal(validateComponentTree([{ id: name, component: name, props: { ...props, desktopPaddingTop: -1 } }]).valid, false);
}
assert.match(render(ButtonBlock, { newTab: true, linkTarget: '_self' }), /target="_self"/);
assert.doesNotMatch(render(ButtonBlock, { newTab: true, linkTarget: '_self' }), /noopener/);
assert.match(render(ButtonBlock, { linkTarget: '_blank' }), /rel="noopener noreferrer"/);
assert.equal(normalizeProps(componentSchemas.Button, { linkTarget: 'malicious' }).linkTarget, undefined);
const updates = [];
const rendered = ComponentRenderer({ component: { id: 'cta', component: 'Button', props: { text: 'Original' } }, onUpdateComponentProp: (...args) => updates.push(args) });
assert.equal(rendered.props.editorTextProps.contentEditable, 'plaintext-only');
rendered.props.editorTextProps.onBlur({ currentTarget: { innerText: 'New label' } });
assert.deepEqual(updates, [['cta', 'text', 'New label']]);
const empty = { innerText: '', textContent: '' };
rendered.props.editorTextProps.onBlur({ currentTarget: empty });
assert.equal(empty.textContent, 'Original');
let prevented = false;
ButtonBlock({ editorTextProps: rendered.props.editorTextProps }).props.onClick({ preventDefault: () => { prevented = true; } });
assert.ok(prevented);
assert.equal(ButtonBlock({}).props.onClick, undefined);
console.log('Shared responsive styles and inline button editing checks passed.');
const { normalizePageDesign, validatePageDesign, googleFontUrl, fontStack, resolvePageFont, removePageFont } = require('../renderer/pageDesign.ts');
const { pageResponsiveCss } = require('../renderer/PageDesignStyles.tsx');
const { PageRenderer } = require('../renderer/ComponentRenderer.tsx');
assert.equal(normalizePageDesign().mobileMaxWidth, 720);
assert.equal(normalizePageDesign({ mobileMaxWidth: 980 }).mobileMaxWidth, 980);
for (const value of [0, 319, 1601, 768.5, Infinity, '800', '800){body{display:none}}']) {
  assert.equal(normalizePageDesign({ mobileMaxWidth: value }).mobileMaxWidth, 720);
  assert.ok(validatePageDesign({ mobileMaxWidth: value }).length);
}
assert.ok(validatePageDesign({ fonts: ['Unknown Font'] }).length);
assert.ok(validatePageDesign({ fonts: ['Inter', 'Inter'] }).length);
assert.ok(validatePageDesign({ fonts: ['Inter'], defaultFont: 'Roboto' }).length);
assert.ok(validatePageDesign({ script: 'alert(1)' }).length);
assert.deepEqual(validatePageDesign({ mobileMaxWidth: 900, fonts: ['Inter'], defaultFont: 'Inter' }), []);
assert.equal(googleFontUrl('evil"</style>'), undefined);
assert.equal(googleFontUrl('Roboto'), 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap');
assert.equal(resolvePageFont('Roboto', { fonts: ['Inter'], defaultFont: 'Inter' }), 'Inter');
assert.equal(resolvePageFont('system', { fonts: ['Inter'], defaultFont: 'Inter' }), 'system');
const config = { mobileMaxWidth: 980, fonts: ['Inter', 'Roboto'], defaultFont: 'Inter' };
const styledPage = render(PageRenderer, { design: config, components: [{ id: 'heading', component: 'Text', props: { text: 'Title', fontFamily: 'Roboto' } }] });
assert.match(styledPage, /page-breakpoint-980/);
assert.match(styledPage, /@media not all and \(max-width: 980px\)/);
assert.match(styledPage, /font-family:&#x27;Roboto&#x27;/);
assert.match(styledPage, /fonts.googleapis.com/);
assert.doesNotMatch(render(PageRenderer, { components: [] }), /fonts.googleapis.com/);
const removed = removePageFont({ design: config, components: [{ id: 'parent', component: 'Container', props: {}, children: [{ id: 'text', component: 'Text', props: { fontFamily: 'Inter' } }] }] }, 'Inter');
assert.deepEqual(removed.design.fonts, ['Roboto']);
assert.equal(removed.design.defaultFont, 'system');
assert.equal(removed.components[0].children[0].props.fontFamily, 'inherit');
assert.match(pageResponsiveCss(config), /page-renderer.page-breakpoint-980/);
assert.match(pageResponsiveCss(config), /--r-paddingTop:var\(--r-desktop-paddingTop\)/);
assert.equal(fontStack('url(evil)'), fontStack('system'));
console.log('Page design, fonts and server rendering checks passed.');

const { NavbarBlock } = require('../components/base/NavbarBlock/NavbarBlock.tsx');
const navProps = normalizeProps(componentSchemas.Navbar, {
  logoText: 'Empresa Alpha',
  logoHref: '/',
  link1Text: 'Home',
  link1Url: '/',
  link2Text: 'Portfólio',
  link2Url: '#portfolio',
  ctaText: 'Contato Rápido',
  ctaUrl: '#contato',
  linkColor: '#ff0000',
  ctaBackgroundColor: '#00ff00',
  ctaTextColor: '#0000ff'
});
const navbarMarkup = render(NavbarBlock, navProps);
assert.match(navbarMarkup, /base-navbar/);
assert.match(navbarMarkup, /Empresa Alpha/);
assert.match(navbarMarkup, /Home/);
assert.match(navbarMarkup, /Portfólio/);
assert.match(navbarMarkup, /Contato Rápido/);
assert.match(navbarMarkup, /navbar-toggle mobile-only/);
assert.match(navbarMarkup, /color:#ff0000/);
assert.match(navbarMarkup, /background-color:#00ff00/);
assert.equal(validateComponentTree([{ id: 'nav-1', component: 'Navbar', props: navProps }]).valid, true);
assert.equal(validateComponentTree([{ id: 'nav-1', component: 'Navbar', props: { ...navProps, link1Url: 'javascript:alert(1)' } }]).valid, false);

// Teste de N links dinâmicos e cor de fundo personalizada
const navDynamicProps = normalizeProps(componentSchemas.Navbar, {
  logoText: 'Empresa Beta',
  backgroundColor: '#112233',
  links: [
    { text: 'Link Um', url: '#1' },
    { text: 'Link Dois', url: '#2' },
    { text: 'Link Tres', url: '#3' },
    { text: 'Link Quatro', url: '#4' },
    { text: 'Link Cinco', url: '#5' },
    { text: 'Link Seis', url: '#6' },
    { text: 'Link Sete', url: '#7' }
  ]
});
const dynamicMarkup = render(NavbarBlock, navDynamicProps);
assert.match(dynamicMarkup, /background-color:#112233/);
assert.match(dynamicMarkup, /Link Um/);
assert.match(dynamicMarkup, /Link Sete/);
assert.equal(validateComponentTree([{ id: 'nav-dynamic', component: 'Navbar', props: navDynamicProps }]).valid, true);

console.log('Navbar rendering, links and sandwich menu checks passed.');

const { ATOMIC_CATEGORIES, componentCatalog, getCatalogByCategory } = require('../components/editor/PageEditor/componentCatalog.ts');
const { AddComponentModal } = require('../components/editor/PageEditor/AddComponentModal.tsx');

assert.deepEqual(ATOMIC_CATEGORIES.map(c => c.id), ['atom', 'molecule', 'organism']);
for (const [name, schema] of Object.entries(componentSchemas)) {
  assert.ok(['atom', 'molecule', 'organism'].includes(schema.category), `${name} must have a valid atomic category`);
  assert.ok(typeof schema.description === 'string' && schema.description.length > 0, `${name} must have a description`);
}
for (const category of ['atom', 'molecule', 'organism']) {
  const items = getCatalogByCategory(category);
  assert.ok(items.length >= 2, `Category ${category} should have at least 2 items`);
}
for (const item of componentCatalog) {
  const node = item.createNode();
  const validation = validateComponentTree([node]);
  assert.equal(validation.valid, true, `Catalog item ${item.id} failed validation: ${validation.errors.join(', ')}`);
}
const modalMarkup = render(AddComponentModal, {
  canAddChild: true,
  isOpen: true,
  target: { kind: 'root' },
  onClose: () => {},
  onSelect: () => {}
});
assert.match(modalMarkup, /add-component-modal-body/);
assert.match(modalMarkup, /Átomos/);
assert.match(modalMarkup, /Moléculas/);
assert.match(modalMarkup, /Organismos/);
console.log('Atomic design catalog and scrollable modal checks passed.');

const { FormBlock, buildWhatsappUrl } = require('../components/base/FormBlock/FormBlock.tsx');
const formProps = normalizeProps(componentSchemas.Form, {
  phoneNumber: '+55 (11) 98765-4321',
  title: 'Orçamento via WhatsApp',
  subtitle: 'Envie seus dados para atendimento imediato.',
  introMessage: 'Olá! Gostaria de solicitar um orçamento:',
  buttonText: 'Chamar no WhatsApp',
  customFields: [
    { id: 'f1', label: 'Nome completo', type: 'text', placeholder: 'Ex: Ana', required: true },
    { id: 'f2', label: 'E-mail', type: 'email', placeholder: 'ana@email.com', required: false },
    { id: 'f3', label: 'Detalhes', type: 'textarea', placeholder: 'Sua necessidade', required: true }
  ]
});
assert.equal(componentSchemas.Form.category, 'molecule');
assert.equal(componentSchemas.Form.acceptsChildren, false);
const formMarkup = render(FormBlock, formProps);
assert.match(formMarkup, /base-whatsapp-form/);
assert.match(formMarkup, /Orçamento via WhatsApp/);
assert.match(formMarkup, /Nome completo/);
assert.match(formMarkup, /Obrigatório/);
assert.match(formMarkup, /Opcional/);
assert.match(formMarkup, /Chamar no WhatsApp/);
assert.equal(validateComponentTree([{ id: 'wa-form-1', component: 'Form', props: formProps }]).valid, true);
assert.equal(
  validateComponentTree([
    {
      id: 'wa-form-invalid',
      component: 'Form',
      props: { ...formProps, customFields: [{ label: '', type: 'invalid', required: 'yes' }] }
    }
  ]).valid,
  false
);
const waUrl = buildWhatsappUrl(
  formProps.phoneNumber,
  formProps.introMessage,
  formProps.customFields,
  { 0: 'Ana Silva', 2: 'Preciso de uma landing page' }
);
assert.ok(waUrl.startsWith('https://wa.me/5511987654321?text='));
assert.match(decodeURIComponent(waUrl), /\*Nome completo:\* Ana Silva/);
assert.match(decodeURIComponent(waUrl), /\*Detalhes:\* Preciso de uma landing page/);
console.log('WhatsApp form rendering, custom fields, required toggle and URL builder checks passed.');

const { FooterBlock } = require('../components/base/FooterBlock/FooterBlock.tsx');
const { createEditorComponent, flattenComponents } = require('../components/editor/PageEditor/pageTree.ts');
assert.equal(componentSchemas.Footer.category, 'organism');
assert.equal(componentSchemas.Footer.acceptsChildren, true);
const composedFooter = createEditorComponent('Footer');
assert.equal(validateComponentTree([composedFooter]).valid, true);
const footerNodes = flattenComponents([composedFooter]);
assert.ok(footerNodes.some(node => node.component === 'Container'));
assert.ok(footerNodes.some(node => node.component === 'Grid'));
assert.ok(footerNodes.some(node => node.component === 'Flex'));
assert.ok(footerNodes.some(node => node.component === 'Text'));
assert.ok(footerNodes.some(node => node.component === 'Link'));
assert.ok(footerNodes.some(node => node.component === 'Spacer'));
// Verify the contact column is a Flex container holding N Text items that can be freely extended
const contactCol = footerNodes.find(node => node.id.startsWith('footer-contact-col'));
assert.ok(contactCol && contactCol.component === 'Flex');
assert.ok(contactCol.children.length >= 4 && contactCol.children.every(child => child.component === 'Text'));
const footerMarkup = render(PageRenderer, { components: [composedFooter] });
assert.match(footerMarkup, /<footer class="base-footer responsive-component"/);
assert.match(footerMarkup, /base-grid/);
assert.match(footerMarkup, /base-flex/);
assert.match(footerMarkup, /base-text/);
assert.match(footerMarkup, /Minha Marca/);
assert.match(footerMarkup, /Contato/);
assert.match(footerMarkup, /WhatsApp: \(11\) 99999-9999/);
assert.equal(RenderFooterDirect(), true);
function RenderFooterDirect() {
  const direct = render(FooterBlock, normalizeProps(componentSchemas.Footer, { background: '#111827', paddingY: 48 }));
  assert.match(direct, /background:#111827/);
  return true;
}
console.log('Lean composable Footer (built from Container, Grid, Flex, Text, Link, Spacer) checks passed.');
