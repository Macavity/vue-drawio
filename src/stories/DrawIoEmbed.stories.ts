import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { DrawIoEmbed } from '../index';

const meta = {
  title: 'DrawIoEmbed',
  component: DrawIoEmbed,
  argTypes: {
    autosave: {
      control: 'boolean',
      description: 'Enable autosave functionality',
    },
    baseUrl: {
      control: 'text',
      description: 'Base URL for draw.io embed',
    },
    urlParameters: {
      control: 'object',
      description: 'URL parameters for customization',
    },
    xml: {
      control: 'text',
      description: 'Initial XML diagram data',
    },
    csv: {
      control: 'text',
      description: 'Initial CSV data for diagram',
    },
    configuration: {
      control: 'object',
      description: 'Configuration options',
    },
    exportFormat: {
      control: 'select',
      options: ['html', 'html2', 'svg', 'xmlsvg', 'png', 'xmlpng'],
      description: 'Default export format',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DrawIoEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple story showing basic usage
export const Basic: Story = {
  render: (args: any) => ({
    components: { DrawIoEmbed },
    setup() {
      return { args };
    },
    template: `<DrawIoEmbed v-bind="args" style="width: 100%; height: 80vh;" />`,
  }),
  args: {
    autosave: false,
    exportFormat: 'xmlsvg',
  },
};

// Story with custom URL parameters
export const WithCustomSettings: Story = {
  render: (args: any) => ({
    components: { DrawIoEmbed },
    setup() {
      return { args };
    },
    template: `<DrawIoEmbed v-bind="args" style="width: 100%; height: 80vh;" />`,
  }),
  args: {
    urlParameters: {
      ui: 'kennedy',
      spin: true,
      libraries: true,
      saveAndExit: true,
      dark: true,
    },
  },
};

// Story with initial XML data
export const WithInitialXml: Story = {
  render: (args: any) => ({
    components: { DrawIoEmbed },
    setup() {
      return { args };
    },
    template: `<DrawIoEmbed v-bind="args" style="width: 100%; height: 80vh;" />`,
  }),
  args: {
    xml: `<mxfile><diagram id="diagram-123" name="Page-1"><mxgraph><mxcell id="0" /><mxcell id="1" parent="0" /><mxcell id="2" value="Hello World" style="shape=ellipse;fillColor=#FFCC00;strokeColor=#FF9900;" vertex="1" parent="1"><mxgeometry x="200" y="150" width="120" height="80" as="geometry" /></mxcell></mxgraph></diagram></mxfile>`,
  },
};

// Story with event handling
export const WithEvents: Story = {
  render: (args: any) => ({
    components: { DrawIoEmbed },
    setup() {
      const handleEvent = (eventName: string, data: any) => {
        console.log(`${eventName} event:`, data);
      };

      return {
        args,
        handleEvent,
      };
    },
    template: `
      <div>
        <h2>DrawIoEmbed with Event Handling</h2>
        <p>Check the console for event logs</p>
        <DrawIoEmbed 
          v-bind="args"
          @load="handleEvent('load', $event)"
          @save="handleEvent('save', $event)"
          @autosave="handleEvent('autosave', $event)"
          @close="handleEvent('close', $event)"
          @export="handleEvent('export', $event)"
          style="width: 100%; height: 80vh;"
        />
      </div>
    `,
  }),
  args: {
    autosave: true,
  },
};

// Story showing programmatic control
export const ProgrammaticControl: Story = {
  render: (args: any) => ({
    components: { DrawIoEmbed },
    setup() {
      const drawioRef = ref<InstanceType<typeof DrawIoEmbed> | null>(null);
      const imgData = ref<string | null>(null);

      const exportDiagram = () => {
        if (drawioRef.value) {
          // @ts-ignore - Accessing the exposed methods
          drawioRef.value.exportDiagram({
            format: 'xmlsvg'
          });
        }
      };

      const handleExport = (data: any) => {
        imgData.value = data.data;
        console.log('Exported diagram data:', data);
      };

      return {
        args,
        drawioRef,
        imgData,
        exportDiagram,
        handleExport,
      };
    },
    template: `
      <div>
        <div style="margin-bottom: 1rem;">
          <button @click="exportDiagram" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Export Diagram
          </button>
        </div>
        
        <DrawIoEmbed 
          ref="drawioRef"
          v-bind="args"
          @export="handleExport"
          style="width: 100%; height: 60vh;"
        />
        
        <div v-if="imgData" style="margin-top: 1rem; border: 1px solid #ccc; padding: 1rem;">
          <h3>Exported Diagram Preview</h3>
          <div style="overflow: auto;">
            <img :src="imgData" style="max-width: 100%; height: auto;" />
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    autosave: true,
  },
};
