import { createPinia } from 'pinia';
import { useUserStore } from '@/store/auth';

const pinia = createPinia();

pinia.use(useUserStore);

export { pinia };