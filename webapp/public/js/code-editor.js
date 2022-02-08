loadjs([
  '/vendor/codemirror/codemirror.css',
  '/vendor/codemirror/codemirror.js'], function() {
  init_editor();
});
init_editor = () => {
  loadjs([
        '/vendor/codemirror/theme/mbo.css',
        '/vendor/codemirror/mode/javascript/javascript.js',
      ],
      function() {
        window.editor_json = CodeMirror.fromTextArea(
            document.getElementById('code-editor'), {
              mode: {name: 'javascript', json: true},
              lineNumbers: true,
              lineWrapping: true,
              foldGutter: true,
              theme: 'mbo',
            });
      });
};