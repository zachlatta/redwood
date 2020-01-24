import { presetEnvConfig, pluginModuleResolveAliasSrcDir } from '../../babel.config.mjs'

export default {
  "extends": "../../babel.config.mjs",
  "presets": [
    presetEnvConfig("node"),
  ],
  "plugins": [
    pluginModuleResolveAliasSrcDir(),
  ],
}