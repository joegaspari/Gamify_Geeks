import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';

const languageList = {
  JavaScript: javascript(),
  Java: java(),
  Python: python(),
  Rust: rust(),
  TypeScript: javascript(),
  PHP: php(),
  SQL: sql(),
  CSS: css(),
  HTML: html()
};

export default languageList;