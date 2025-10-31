import FormHooks from './hooks/form_hooks';
import AuthHooks from './hooks/auth_hooks'
import StyleHooks from './hooks/style_hooks'
import StorageHooks from './hooks/storage_hooks'
import ActiveTabHook from './hooks/active_tab_hook'

let Hooks = {
  ...FormHooks,
  ...AuthHooks,
  ...StyleHooks,
  ...StorageHooks,
  ...ActiveTabHook
};

export default Hooks;

