// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    '@stylistic': stylistic,
  },
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    //stylistic.configs.recommended,
  ],
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    "@typescript-eslint/no-inferrable-types": ["error", { ignoreParameters: true , ignoreProperties: true }],

    // stylistic
    "@stylistic/array-bracket-newline": ["error", { multiline: true, minItems: 2 }], //TODO: should minItems be null or 0?
    "@stylistic/array-bracket-spacing": ["error", "never"],
    "@stylistic/array-element-newline": ["error", "consistent"],
    "@stylistic/arrow-parens": ["error", "always"],
    "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
    "@stylistic/block-spacing": ["error", "always"],
    "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: false }],
    "@stylistic/comma-dangle": ["error", "always-multiline"],
    "@stylistic/comma-spacing": ["error", { before: false, after: true }],
    "@stylistic/comma-style": ["error", "last"],
    "@stylistic/computed-property-spacing": ["error", "never"],
    "@stylistic/curly-newline": ["error", "always"], //TODO: this may be too aggressive
    "@stylistic/dot-location": ["error", "property"],
    "@stylistic/eol-last": ["error", "always"],
    "@stylistic/func-call-spacing": ["error", "never"],
    "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
    "@stylistic/generator-star-spacing": ["error", "before"],
    "@stylistic/implicit-arrow-linebreak": ["error", "beside"],
    "@stylistic/indent": ["error", 4],
    "@stylistic/indent-binary-ops": ["error", 4],
    // Skipping @stylistic jsx rules
    "@stylistic/key-spacing": ["error", { beforeColon: false, afterColon: true, mode: "strict" }], //TODO: can be fine adjusted with singleLine, multiLine, align and ignoredNodes objects.
    "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
    // Skipping @stylistic/line-comment-position
    "@stylistic/linebreak-style": ["error", "unix"],
    "@stylistic/lines-around-comment": [
      "error",
      {
        beforeBlockComment: true,
        afterBlockComment: false,
        beforeLineComment: true,
        afterLineComment: false,
        allowBlockStart: true,
        allowBlockEnd: false,
        allowClassStart: true,
        allowClassEnd: false,
        allowObjectStart: true,
        allowObjectEnd: false,
        allowArrayStart: true,
        allowArrayEnd: false,
        afterHashbangComment: true,

        // TS
        allowEnumEnd: false,
        allowEnumStart: true,
        allowInterfaceEnd: false,
        allowInterfaceStart: true,
        allowModuleEnd: false,
        allowModuleStart: true,
        allowTypeEnd: false,
        allowTypeStart: true,
      }
    ], //TODO: did not use applyDefaultIgnorePatterns, maybe needed later
    "@stylistic/lines-between-class-members": ["error", { enforce: [/*{blankLine: "never", prev: "field", next: "field"}, */{blankLine: "always", prev: "*", next: "method"}] }],
    "@stylistic/max-len": ["error", {code: 80, ignoreComments: true, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true}],
    "@stylistic/max-statements-per-line": ["error", { max: 1 }], //TODO: maybe too strict
    "@stylistic/member-delimiter-style": ["error", {multiline: {delimiter: "comma", requireLast: true}, singleline: {delimiter: "comma", requireLast: false}, multilineDetection: "brackets"}],
    "@stylistic/multiline-comment-style": ["error", "starred-block"],
    "@stylistic/multiline-ternary": ["error", "always-multiline"],
    "@stylistic/new-parens": ["error", "always"],
    "@stylistic/newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
    "@stylistic/no-confusing-arrow": ["error", { allowParens: true, onlyOneSimpleParam: false }], //TODO: maybe too strict
    "@stylistic/no-extra-parens": ["error", "all", { enforceForArrowConditionals: false }], //TODO: could need fine tuning
    "@stylistic/no-extra-semi": ["error"],
    "@stylistic/no-floating-decimal": ["error"],
    "@stylistic/no-mixed-operators": ["error", { allowSamePrecedence: true }],
    "@stylistic/no-mixed-spaces-and-tabs": ["error"],
    "@stylistic/no-multi-spaces": ["error"],
    "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
    "@stylistic/no-tabs": ["error"],
    "@stylistic/no-trailing-spaces": ["error"],
    "@stylistic/no-whitespace-before-property": ["error"],
    "@stylistic/nonblock-statement-body-position": ["error", "any"],
    "@stylistic/object-curly-newline": ["error", { multiline: true, consistent: true }],
    "@stylistic/object-curly-spacing": ["error", "always"],
    "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
    "@stylistic/one-var-declaration-per-line": ["error", "initializations"],
    "@stylistic/operator-linebreak": ["error", "after", { overrides: { "?": "before", ":": "before" } }],
    "@stylistic/padded-blocks": ["error", "never"],
    "@stylistic/padding-line-between-statements": [ //TODO: conditions may be need to be added or modified later
      "error",
      { blankLine: "always", prev: "*", next: "return" },
      { blankLine: "always", prev: "*", next: "break" },
      { blankLine: "always", prev: "*", next: "continue" },
      { blankLine: "never", prev: "*", next: "case" },
      { blankLine: "never", prev: "*", next: "default" },
      { blankLine: "always", prev: "*", next: "throw" },
      { blankLine: "always", prev: "*", next: "try" },
      { blankLine: "always", prev: "*", next: "if" },
      { blankLine: "always", prev: "if", next: "*" },
      { blankLine: "always", prev: "*", next: "do" },
      { blankLine: "always", prev: "*", next: "while" },
      { blankLine: "always", prev: "*", next: "for" },
      { blankLine: "always", prev: "*", next: "switch" },
      { blankLine: "always", prev: "*", next: "block" },
      { blankLine: "always", prev: "*", next: "with" },
      { blankLine: "always", prev: "*", next: "function" },

      { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
      { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },

      { blankLine: "always", prev: "*", next: "export" },

      { blankLine: "always", prev: "*", next: "import" },
      { blankLine: "always", prev:"import", next: "*" },
      { blankLine: "never", prev: "import", next: "import" },

      { blankLine: "always", prev: "*", next: "class" },
      { blankLine: "always", prev: "*", next: "enum" },
    ],
    "@stylistic/quote-props": ["error", "as-needed", { keywords: true, unnecessary: true, numbers: true }],
    "@stylistic/quotes": ["error", "single", { avoidEscape: true, allowTemplateLiterals: "always" }],
    "@stylistic/rest-spread-spacing": ["error", "never"],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/semi-spacing": ["error", { before: false, after: true }], // For loops are mostly affected by this rule
    "@stylistic/semi-style": ["error", "last"],
    "@stylistic/space-before-blocks": ["error", "always"],
    "@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
    "@stylistic/space-in-parens": ["error", "never"],
    "@stylistic/space-infix-ops": ["error"],
    "@stylistic/space-unary-ops": ["error", { words: true, nonwords: false }],
    "@stylistic/spaced-comment": ["error", "always"],
    "@stylistic/switch-colon-spacing": ["error", { after: true, before: false }],
    "@stylistic/template-curly-spacing": ["error", "never"],
    "@stylistic/template-tag-spacing": ["error", "never"],
    "@stylistic/type-annotation-spacing": ["error", { before: false, after: true, overrides: { arrow: { before: true, after: true } } }],
    "@stylistic/type-generic-spacing": ["error"],
    "@stylistic/type-named-tuple-spacing": ["error"],
    "@stylistic/wrap-iife": ["error", "inside", { functionPrototypeMethods: true }],
    // Skipping @stylistic/wrap-regex
    "@stylistic/yield-star-spacing": ["error", "before"],
  },
});
