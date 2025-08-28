# Proyecto de Componentes HTML para FileMaker

## Propósito General

Este repositorio sirve como un espacio centralizado para el desarrollo, gestión y versionado de diversos componentes web (HTML, CSS y JavaScript). El objetivo principal es crear interfaces de usuario dinámicas y modernas que se integrarán en soluciones de FileMaker a través de Web Viewers.

Al desarrollar los componentes de forma externa, podemos aprovechar las tecnologías web modernas para superar las limitaciones de la interfaz nativa de FileMaker y ofrecer una experiencia de usuario más rica y fluida.

## Estructura

Cada carpeta principal en este repositorio representa un conjunto de funcionalidades o un "módulo" autocontenido. Por ejemplo, la carpeta `whatsapp/` contiene una serie de componentes relacionados con la interacción con eñ apartado de WhatsApp.

La idea es que cada módulo contenga todo lo necesario para funcionar de manera independiente.

## Uso e Integración

1.  **Desarrollo:** Clona este repositorio para desarrollar o modificar un componente en tu entorno de desarrollo local.
2.  **Pruebas:** Cada componente puede ser probado en un navegador web estándar antes de la integración.
3.  **Integración:** Para usar un componente en FileMaker, simplemente carga el código en tu solución o haz referencia a los archivos HTML desde un objeto Web Viewer. Los scripts de utilidad (como `filemaker.js`) están diseñados para facilitar la comunicación bidireccional entre el componente web y la lógica de FileMaker.

Este enfoque modular nos permite reutilizar componentes en diferentes proyectos de FileMaker y mantener el código de la interfaz de usuario limpio y organizado.
