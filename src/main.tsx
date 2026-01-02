import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WidgetApp } from './widget/WidgetApp.tsx';
import { ChatEmbedApp } from './embed/ChatEmbedApp.tsx';

const path = window.location.pathname;
const isWidget = path.startsWith('/widget');
const isEmbed = path.startsWith('/embed/agent/');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWidget ? <WidgetApp /> : isEmbed ? <ChatEmbedApp /> : <App />}
  </StrictMode>
);
