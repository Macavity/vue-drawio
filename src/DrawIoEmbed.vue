<template>
  <iframe
    class="diagrams-iframe"
    :src="iframeUrl"
    ref="iframeRef"
    allow="clipboard-read; clipboard-write"
    title="Diagrams.net"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { getEmbedUrl } from './utils/getEmbedUrl';
import { handleEvent } from './utils/handleEvent';
import { useActions } from './hooks/useActions';

// Define props without TypeScript generic syntax to avoid build issues
const props = withDefaults(defineProps<{
  autosave?: boolean;
  baseUrl?: string;
  urlParameters?: any;
  xml?: string;
  csv?: string;
  configuration?: { [key: string]: any };
  exportFormat?: string;
  onLoad?: (data: any) => void;
  onAutoSave?: (data: any) => void;
  onSave?: (data: any) => void;
  onClose?: (data: any) => void;
  onConfigure?: (data: any) => void;
  onMerge?: (data: any) => void;
  onPrompt?: (data: any) => void;
  onTemplate?: (data: any) => void;
  onDraft?: (data: any) => void;
  onExport?: (data: any) => void;
}>(), {
  autosave: false
});

// Define emit types
const emit = defineEmits<{
  (e: 'load', data: any): void;
  (e: 'autosave', data: any): void;
  (e: 'save', data: any): void;
  (e: 'close', data: any): void;
  (e: 'configure', data: any): void;
  (e: 'merge', data: any): void;
  (e: 'prompt', data: any): void;
  (e: 'template', data: any): void;
  (e: 'draft', data: any): void;
  (e: 'export', data: any): void;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const isInitialized = ref(false);
const action = useActions(iframeRef);

const iframeUrl = computed(() => {
  return getEmbedUrl(props.baseUrl, props.urlParameters, !!props.configuration);
});

const messageHandler = (evt: MessageEvent) => {
  handleEvent(
    evt,
    {
      init: () => {
        isInitialized.value = true;
      },
      load: (data) => {
        props.onLoad?.(data);
        emit('load', data);
      },
      configure: (data) => {
        if (props.configuration) {
          action.configure({ config: props.configuration });
        }
        props.onConfigure?.(data);
        emit('configure', data);
      },
      autosave: (data) => {
        props.onAutoSave?.(data);
        emit('autosave', data);
      },
      save: (data) => {
        action.exportDiagram({
          format: (props.exportFormat as any) || 'xmlsvg',
          // @ts-ignore not allowed normally, but only for internal use
          exit: data.exit,
          parentEvent: 'save'
        });
      },
      exit: (data) => {
        props.onClose?.(data);
        emit('close', data);
      },
      draft: (data) => {
        props.onDraft?.(data);
        emit('draft', data);
      },
      export: (data) => {
        props.onSave?.({
          event: 'save',
          xml: data.data,
          parentEvent: data.message.parentEvent || 'export'
        });
        emit('save', {
          event: 'save',
          xml: data.data,
          parentEvent: data.message.parentEvent || 'export'
        });
        
        props.onExport?.(data);
        emit('export', data);
        
        // @ts-ignore not allowed normally, but only for internal use
        if (data.message.exit) {
          props.onClose?.({
            event: 'exit',
            modified: true,
            parentEvent: data.message.parentEvent || 'export'
          });
          emit('close', {
            event: 'exit',
            modified: true,
            parentEvent: data.message.parentEvent || 'export'
          });
        }
      },
      merge: (data) => {
        props.onMerge?.(data);
        emit('merge', data);
      },
      prompt: (data) => {
        props.onPrompt?.(data);
        emit('prompt', data);
      },
      template: (data) => {
        props.onTemplate?.(data);
        emit('template', data);
      }
    },
    props.baseUrl
  );
};

watch(
  [isInitialized, () => props.xml, () => props.csv, () => props.autosave],
  ([initialized, xml, csv, autosave]) => {
    if (initialized) {
      let loadObject: any = {};
      if (xml) {
        if (props.exportFormat === 'xmlpng') {
          loadObject = { xmlpng: xml };
        } else {
          loadObject = { xml };
        }
      } else if (csv) {
        loadObject = { descriptor: { format: 'csv', data: csv } };
      } else {
        loadObject = { xml: '' };
      }

      loadObject = {
        ...loadObject,
        autosave
      };

      action.load(loadObject);
    }
  },
  { deep: true }
);

onMounted(() => {
  window.addEventListener('message', messageHandler);
});

onUnmounted(() => {
  window.removeEventListener('message', messageHandler);
});

defineExpose({
  ...action
});
</script>

<style scoped>
.diagrams-iframe {
  width: 100%;
  height: 100%;
  min-width: 400px;
  min-height: 400px;
  border: none;
}
</style>