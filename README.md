[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)
[![npm package][npm-coreui-angular-badge]][npm-coreui-angular]
[![NPM downloads][npm-coreui-angular-download]][npm-coreui-angular]  
[![@coreui coreui](https://img.shields.io/badge/@coreui%20-coreui-lightgrey.svg?style=flat-square)](https://github.com/coreui/coreui)
[![npm package][npm-coreui-badge]][npm-coreui]
[![NPM downloads][npm-coreui-download]][npm-coreui]  
![angular](https://img.shields.io/badge/angular-^11.0.9-lightgrey.svg?style=flat-square&logo=angular)  

[npm-coreui-angular]: https://www.npmjs.com/package/@coreui/angular  
[npm-coreui-angular-badge]: https://img.shields.io/npm/v/@coreui/angular.png?style=flat-square  
[npm-coreui-angular-download]: https://img.shields.io/npm/dm/@coreui/angular.svg?style=flat-square  
[npm-coreui]: https://www.npmjs.com/package/@coreui/coreui
[npm-coreui-badge]: https://img.shields.io/npm/v/@coreui/coreui.png?style=flat-square
[npm-coreui-download]: https://img.shields.io/npm/dm/@coreui/coreui.svg?style=flat-square

# CoreUI Free Angular 2+ Admin Template [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)](https://twitter.com/intent/tweet?text=CoreUI%20-%20Free%20Bootstrap%204%20Admin%20Template%20&url=https://coreui.io&hashtags=bootstrap,admin,template,dashboard,panel,free,angular,react,vue)

Please help us on [Product Hunt](https://www.producthunt.com/posts/coreui-open-source-bootstrap-4-admin-template-with-angular-2-react-js-vue-js-support) and [Designer News](https://www.designernews.co/stories/81127). Thanks in advance!

Curious why I decided to create CoreUI? Please read this article: [Jack of all trades, master of none. Why Bootstrap Admin Templates suck.](https://medium.com/@lukaszholeczek/jack-of-all-trades-master-of-none-5ea53ef8a1f#.7eqx1bcd8)

CoreUI is an Open Source Bootstrap Admin Template. But CoreUI is not just another Admin Template. It goes way beyond hitherto admin templates thanks to transparent code and file structure. And if that's not enough, let’s just add that CoreUI consists bunch of unique features and over 1000 high quality icons.

CoreUI is based on Bootstrap 4 and offers 6 versions: 
[HTML5 AJAX](https://github.com/coreui/coreui-free-bootstrap-admin-template-ajax), 
[HTML5](https://github.com/coreui/coreui-free-angular-admin-template), 
[Angular 2+](https://github.com/coreui/coreui-free-angular-admin-template), 
[React.js](https://github.com/coreui/coreui-free-react-admin-template), 
[Vue.js](https://github.com/coreui/coreui-free-vue-admin-template)
 & [.NET Core 2](https://github.com/mrholek/CoreUI-NET).

CoreUI is meant to be the UX game changer. Pure & transparent code is devoid of redundant components, so the app is light enough to offer ultimate user experience. This means mobile devices also, where the navigation is just as easy and intuitive as on a desktop or laptop. The CoreUI Layout API lets you customize your project for almost any device – be it Mobile, Web or WebApp – CoreUI covers them all!

## Versions

CoreUI is built on top of Bootstrap 4 and supports popular frameworks.

* [CoreUI Free Bootstrap Admin Template](https://github.com/coreui/coreui-free-bootstrap-admin-template)
* [CoreUI Free Bootstrap Admin Template (Ajax)](https://github.com/coreui/coreui-free-bootstrap-admin-template-ajax)
* [CoreUI Free Angular 2+ Admin Template](https://github.com/coreui/coreui-free-angular-admin-template)
* [CoreUI Free React.js Admin Template](https://github.com/coreui/coreui-free-react-admin-template)
* [CoreUI Free Vue.js Admin Template](https://github.com/coreui/coreui-free-vue-admin-template)

#### Prerequisites
Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js
Angular 11 requires `Node.js` version 10.13 or later.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).

###### Angular CLI
Install the Angular CLI globally using a terminal/console window.
```bash
npm install -g @angular/cli
```

##### Update to Angular 11
Angular 11 requires `Node.js` version 10.13 or newer    
Update guide - see: [https://update.angular.io](https://update.angular.io)

## Installation

### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/coreui/coreui-free-angular-admin-template.git my-project

# go into app's directory
$ cd my-project

# install app's dependencies
$ npm install --legacy-peer-deps
```

## Usage

``` bash
# serve with hot reload at localhost:4200.
$ ng serve

# build for production with minification
$ ng build --prod
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
free-angular-admin-template/
├── e2e/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   ├── scss/
│   ├── index.html
│   └── ...
├── .angular-cli.json
├── ...
├── package.json
└── ...
```

## Documentation

Informe de implementación de aplicación web en Docker

Introducción

Este informe describe el proceso de implementación de una aplicación web desarrollada en Node.js v16 con Angular 11.2, TypeScript y Bootstrap 4. La aplicación fue implementada en una máquina virtual Proxmox 141 con sistema operativo Linux Mint 20.3. El servidor tiene la configuración local "America/Caracas".

Requisitos

Para implementar la aplicación web, se necesitan los siguientes requisitos:

Máquina virtual Proxmox 141 con sistema operativo Linux Mint 20.3
Docker instalado en la máquina virtual
Configuración local "America/Caracas" en el servidor
Apache instalado en el servidor
Instalación de Docker

Para instalar Docker en la máquina virtual, siga los siguientes pasos:

Abra una terminal en la máquina virtual.
Ejecute el siguiente comando para actualizar los paquetes del sistema:
```sudo apt update```
Ejecute el siguiente comando para instalar Docker:
```sudo apt install docker.io```
Una vez que Docker esté instalado, inicie el servicio con el siguiente comando:
```sudo systemctl start docker```
Configuración de la zona horaria

Para configurar la zona horaria "America/Caracas" en el servidor, siga los siguientes pasos:

Abra un editor de texto en la máquina virtual.
Abra el archivo /etc/timezone con el editor.
Cambie la línea que contiene la zona horaria actual a la siguiente:
America/Caracas
Guarde los cambios y cierre el editor.
Reinicie el servidor para que los cambios surtan efecto.
Instalación de Apache

Para instalar Apache en la máquina virtual, siga los siguientes pasos:

Abra una terminal en la máquina virtual.
Ejecute el siguiente comando para actualizar los paquetes del sistema:
```sudo apt update```
Ejecute el siguiente comando para instalar Apache:
```sudo apt install apache2```
Una vez que Apache esté instalado, inicie el servicio con el siguiente comando:
```sudo systemctl start apache2```
Comandos para ejecutar la aplicación web

Para ejecutar la aplicación web, siga los siguientes pasos:

En la máquina virtual, vaya a la carpeta donde se encuentra la aplicación web (en la raiz de la carpeta del proyecto donde esta ubicado el archivo dockerfile).
Ejecute el siguiente comando para crear una imagen Docker de la aplicación:
```docker build -t core-admin .```
Una vez que la imagen esté creada, ejecute el siguiente comando para iniciar la aplicación:
```docker run  -d -t -p 4200:80 core-admin```
El comando docker build crea una imagen Docker de la aplicación web. El comando docker run inicia la aplicación en un contenedor Docker.

Explicación de los comandos

docker build
El comando docker build crea una imagen Docker a partir de un archivo Dockerfile. El archivo Dockerfile contiene las instrucciones para construir la imagen. En este caso, el archivo Dockerfile contiene las instrucciones para instalar Node.js, Angular y Bootstrap.

docker run
El comando docker run inicia un contenedor Docker a partir de una imagen Docker. En este caso, la imagen Docker es la que se creó con el comando docker build. El comando docker run tiene los siguientes parámetros:

* `-d` : Especifica que el contenedor se debe iniciar en modo demonio.
* `-t` : Especifica que el contenedor debe tener un terminal.
* `-p 4200:80` : Especifica que el puerto 80 del contenedor se debe mapear al puerto 4200 del host.
* `core-admin` : Es el nombre de la imagen Docker que se va a ejecutar.
¿Qué es Docker?

Docker es una plataforma de software que permite crear, ejecutar y administrar aplicaciones en contenedores. Los contenedores son unidades de software que empaquetan código, dependencias y archivos de configuración en un entorno aislado.

Docker ofrece una serie de ventajas, entre las que se incluyen:

Portabilidad: Las aplicaciones empaquetadas en contenedores pueden ejecutarse en cualquier máquina que tenga Docker instalado.
Seguridad: Los contenedores están aislados entre sí, lo que ayuda a proteger las aplicaciones.
Eficiencia: Los contenedores utilizan menos recursos que las máquinas virtuales tradicionales.
Una vez que se hayan completado estos pasos, la aplicación web estará disponible en la dirección http://[dirección IP de la máquina virtual]:80.

The documentation for the CoreUI Free Angularp Admin Template is hosted at our website [CoreUI](https://coreui.io/angular/)

•	VARIABLES DE ENTORNO:
Se debe agregar al sistema operativo las siguientes variables de entrono:
apiUrlServMedico=http://10.50.188.217:3000/sist_epidemiologico/api/
 urlImagenFotoTrabajador=http://10.50.188.48/getimagen.php
extensionFotoTrabajador=.bmp
 fromEmail=brismd@briqven.com.ve
 nameSistemaSalud=’Sistema de Gestión Integral de Salud’
 urlICD=https://icd.who.int/browsell/l-m/es#/
 archivosServidorLocal=http://10.50.188.217/servicio_medico/
hostemailserviciomedico=10.0.3.20
portemailserviciomedico=587
passwemailserviciomedico=brismd.123
dbuserserviciomedico=roberto
 dbhostserviciomedico=10.50.188.48
 dbpasswserviciomedico=roberto
 dbserviciomedico=bdmatserviciomedico
 dbportserviciomedico=5432

## Creators

**Roberto Lunar**

**Mervin Zerpa**