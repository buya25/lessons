// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Code Lessons',
  tagline: 'Learn programming from scratch — one lesson at a time.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://buya25.github.io',
  baseUrl: '/lessons/',

  organizationName: 'buya25',
  projectName: 'lessons',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/buya25/lessons/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Code Lessons',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'lessonsSidebar',
            position: 'left',
            label: 'Lessons',
          },
          {
            href: 'https://github.com/buya25/lessons',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Tracks',
            items: [
              { label: 'Database / SQL', to: '/docs/database/intro' },
              { label: 'Python',         to: '/docs/python/intro' },
              { label: 'React',          to: '/docs/react/intro' },
              { label: 'Node.js',        to: '/docs/nodejs/intro' },
              { label: 'PHP',            to: '/docs/php/intro' },
              { label: 'Java',           to: '/docs/java/intro' },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/buya25/lessons',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Code Lessons. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'php', 'python', 'sql', 'bash'],
      },
    }),
};

export default config;
