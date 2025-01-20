// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // ===DESARROLLO
	apiUrlServMedico: /*'http://10.50.188.217:3000/sist_epidemiologico/api/',*/'http://localhost:3000/sist_epidemiologico/api/',
  urlImagenFotoTrabajador: 'http://10.50.188.48/getimagen.php',
  extensionFotoTrabajador: '.bmp',
  fromEmail: 'brismd@briqven.com.ve',
  nameSistema: 'Sistema de Gestión Integral de Salud',
  urlICD: "https://icd.who.int/browse11/l-m/es#/",
  archivosServidorLocal: 'http://10.50.188.217/servicio_medico/',
};
