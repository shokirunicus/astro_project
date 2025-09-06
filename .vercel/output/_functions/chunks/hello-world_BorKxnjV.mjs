import { t as createVNode, F as Fragment, aJ as __astro_tag_component__ } from './astro/server_CDXv8TJD.mjs';

const frontmatter = {
  "title": "AIHALOブログへようこそ",
  "date": "2025-09-05",
  "tags": ["intro", "strategy"],
  "draft": false,
  "description": "AIコンサルの現場で役立つ示唆を短く、具体的に。"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "なぜ今コンテンツか",
    "text": "なぜ今コンテンツか"
  }];
}
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "経営者・事業責任者のみなさま向けに、90日で意思決定に資するAI活用の道筋を、実例とともに発信していきます。"
    }), "\n", createVNode(_components.h2, {
      id: "なぜ今コンテンツか",
      children: "なぜ今コンテンツか"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "SEOの蓄積で、安定的な流入を作る"
      }), "\n", createVNode(_components.li, {
        children: "事例/洞察で信頼を積み上げる"
      }), "\n", createVNode(_components.li, {
        children: "リード獲得LPへの導線を増やす"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "次回は「固定額アセスメントでROIを素早く見極める」について解説します。"
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}

const url = "src/content/blog/hello-world.mdx";
const file = "/Users/purpl/Projects/astro_project/src/content/blog/hello-world.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/purpl/Projects/astro_project/src/content/blog/hello-world.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
