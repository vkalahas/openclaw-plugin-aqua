declare module "openclaw/plugin-sdk/tool-plugin" {
  import { TSchema, Static } from "typebox";

  export const toolPluginMetadataSymbol: unique symbol;

  export type ToolPluginExecutionContext = {
    api: any;
    signal?: AbortSignal;
    toolCallId: string;
    onUpdate?: (update: any) => void;
  };

  export type ToolPluginConfig<TConfigSchema extends TSchema | undefined> = TConfigSchema extends TSchema
    ? Static<TConfigSchema>
    : Record<string, never>;

  export type ToolPluginToolFactory<TConfig> = <TParamsSchema extends TSchema>(
    definition: ToolPluginToolDefinition<TConfig, TParamsSchema>
  ) => DefinedToolPluginTool;

  export type ToolPluginFactoryContext<TConfig> = {
    api: any;
    config: TConfig;
    toolContext: any;
  };

  export type ToolPluginToolDefinitionBase<TParamsSchema extends TSchema> = {
    name: string;
    label?: string;
    description: string;
    parameters: TParamsSchema;
    optional?: boolean;
  };

  export type ToolPluginToolDefinition<TConfig, TParamsSchema extends TSchema> =
    ToolPluginToolDefinitionBase<TParamsSchema> &
      (
        | {
            execute: (
              params: Static<TParamsSchema>,
              config: TConfig,
              context: ToolPluginExecutionContext
            ) => unknown;
            factory?: never;
          }
        | {
            factory: (context: ToolPluginFactoryContext<TConfig>) => any;
            execute?: never;
          }
      );

  export type DefinedToolPluginTool = {
    name: string;
    label: string;
    description: string;
    parameters: TSchema;
    optional: boolean;
    execute?: (params: unknown, config: unknown, context: ToolPluginExecutionContext) => unknown;
    factory?: (context: ToolPluginFactoryContext<unknown>) => any;
  };

  export type DefineToolPluginOptions<TConfigSchema extends TSchema | undefined = undefined> = {
    id: string;
    name: string;
    description: string;
    activation?: any;
    configSchema?: TConfigSchema;
    tools: (tool: ToolPluginToolFactory<ToolPluginConfig<TConfigSchema>>) => readonly DefinedToolPluginTool[];
  };

  export type DefinedToolPluginEntry = any;

  export function defineToolPlugin<TConfigSchema extends TSchema | undefined = undefined>(
    definition: DefineToolPluginOptions<TConfigSchema>
  ): DefinedToolPluginEntry;

  export function getToolPluginMetadata(entry: unknown): any;
}
