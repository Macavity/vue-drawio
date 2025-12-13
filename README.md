# vue-drawio

Vue 3 component for integrating the <a href="https://app.diagrams.net">Diagrams</a> (<a href="https://www.drawio.com/">draw.io</a>) embed iframe.

This is an unofficial best-effort package based on the embedding documentation that can be found at https://www.drawio.com/doc/faq/embed-mode. 

## Table of Contents

* [Installation](#installation)
* [Examples](#examples)
* [API documentation](#api-documentation)

## Installation

Install this library:

```bash
pnpm add vue-drawio
# or
yarn add vue-drawio
# or
npm i vue-drawio
```

## Examples 
### Simple rendering
```vue
<template>
  <DrawIoEmbed />
</template>

<script setup>
import { DrawIoEmbed } from 'vue-drawio';
</script>
```

### Start with a few settings enabled
```vue
<template>
  <DrawIoEmbed :url-parameters="urlParams" />
</template>

<script setup>
import { DrawIoEmbed } from 'vue-drawio';

const urlParams = {
  ui: 'kennedy',
  spin: true,
  libraries: true,
  saveAndExit: true
};
</script>
```

### Start with existing diagram
```vue
<template>
  <DrawIoEmbed :xml="xmlData" />
</template>

<script setup>
import { DrawIoEmbed } from 'vue-drawio';

const xmlData = '<mxfile>...</mxfile>';
</script>
```

### Export diagram programmatically
```vue
<template>
  <div>
    <button @click="exportDiagram">Export</button>

    <DrawIoEmbed 
      ref="drawioRef"
      @export="handleExport"
    />
    
    <img v-if="imgData" :src="imgData" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DrawIoEmbed, DrawIoEmbedRef } from 'vue-drawio';

const imgData = ref<string | null>(null);
const drawioRef = ref<DrawIoEmbedRef>(null);

const exportDiagram = () => {
  if (drawioRef.value) {
    drawioRef.value.exportDiagram({
      format: 'xmlsvg'
    });
  }
};

const handleExport = (data) => {
  imgData.value = data.data;
};
</script>
```

## API Documentation
All options are based on the documentation at <a href="https://www.drawio.com/doc/faq/embed-mode">draw.io/doc/faq/embed-mode</a>. If something is off, please let me know by creating an <a href="https://github.com/marcveens/react-drawio/issues/new">issue</a>.

### `props`
- `autosave` (`boolean`, default: `false`)\
  When enabled, it will call `onAutoSave` for all changes made
- `urlParameters` (`UrlParameters`, default: `undefined`)\
  Parameters documented at https://www.drawio.com/doc/faq/embed-mode
- `xml` (`string`, default: `undefined`)\
  XML structure for prefilling the editor
- `csv` (`string`, default: `undefined`)\
  CSV structure for prefilling the editor
- `configuration` (`Object`, default: `undefined`)\
  For configuration options, see https://www.drawio.com/doc/faq/configure-diagram-editor
- `exportFormat` (`'html' | 'html2' | 'svg' | 'xmlsvg' | 'png' | 'xmlpng'`, default: `xmlsvg`)\
  Set export format
- `baseUrl` (`string`, default: `https://embed.diagrams.net`)\
  For self hosted instances of draw.io, insert your URL here

- `@load` (`(data: EventLoad) => void`, optional)
- `@autosave` (`(data: EventAutoSave) => void`, optional)\
  This will only trigger when the `autosave` property is `true`
- `@save` (`(data: EventSave) => void`, optional)
- `@close` (`(data: EventExit) => void`, optional)
- `@configure` (`(data: EventConfigure) => void`, optional)
- `@merge` (`(data: EventMerge) => void`, optional)
- `@prompt` (`(data: EventPrompt) => void`, optional)
- `@template` (`(data: EventTemplate) => void`, optional)
- `@draft` (`(data: EventDraft) => void`, optional)
- `@export` (`(data: EventExport) => void`, optional)

### Actions
It is possible to send actions to the Diagrams iframe. These actions are available as functions bound to the `ref` of the component, see [examples](#examples).

- `load` (`(obj: ActionLoad) => void`)\
  Load the contents of a diagram
- `configure` (`(obj: ActionConfigure) => void`)\
Send configuration option to the iframe. Read more about it at https://www.drawio.com/doc/faq/configure-diagram-editor
- `merge` (`(obj: ActionMerge) => void`)\
Merge the contents of the given XML into the current file
- `dialog` (`(obj: ActionDialog) => void`)\
Display a dialog in the editor window
- `prompt` (`(obj: ActionPrompt) => void`)\
Display a prompt in the editor window
- `template` (`(obj: ActionTemplate) => void`)\
Show the template dialog
- `layout` (`(obj: ActionLayout) => void`)\
Runs an array of layouts using the same format as Arrange > Layout > Apply.
- `draft` (`(obj: ActionDraft) => void`)\
Show a draft dialog
- `status` (`(obj: ActionStatus) => void`)\
Display a message in the status bar
- `spinner` (`(obj: ActionSpinner) => void`)\
Display a spinner with a message or hide the current spinner if show is set to false
- `exportDiagram` (`(obj: ActionExport) => void`)