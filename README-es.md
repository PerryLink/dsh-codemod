<div align="center">

# ⬆️ dsh-codemod

> **Renamed:** previously `dsh-plugin-upgrade`; now **`dsh-codemod`**. Old repo stays as a pointer/backup. New home: https://github.com/PerryLink/dsh-codemod


> **Alcance: tres corredores cerrados, hasta `0.2.x`.** `legAB` = `0.1.3-alpha.1` → `0.1.5-rc.1`, `legC` = `0.1.5-rc.2` → `0.1.6-alpha.2`, `legD` = `0.1.6-alpha.2 / 0.1.7` → `0.2.x` (medido contra el checkout `0.2.2-alpha.2` y la base `0.2.1-alpha.2` de la guía). `legD` escanea cinco costuras (`D1`–`D5`); el resto de los cambios 0.2 está en **advisory (not scanned)** — un escaneo limpio no certifica compatibilidad con 0.2. Para actualizaciones rutinarias del bundle, use el `updateBundle()` nativo del gestor de plugins del host.

- **Canal de la tienda 1024**: ejecuta `npm i -g dsh1024` una vez y luego `dsh1024 plugin --profile web add dsh-codemod` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-codemod)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-codemod?metric=downloads&lang=es)](https://dshfind.com/es/plugins/PerryLink/dsh-plugin-upgrade?ref=badge)

**Habilidad de actualización de plugins para DeepSeek Harness — un paquete, un índice de corredores, tres corredores cerrados: `0.1.3-alpha.1` → `0.1.5-rc.1` (`legAB`), `0.1.5-rc.2` → `0.1.6-alpha.2` (`legC`) y `0.1.6-alpha.2 / 0.1.7` → `0.2.x` (`legD`).**

*El escáner se enruta solo: lee la banda dsh declarada por el repositorio destino (o toma `--span`) y luego aplica el catálogo propio de ese corredor, vinculado a evidencia — las 20 costuras de `legAB` (tramo A `0.1.3-alpha.1` → `0.1.5-alpha.1` más tramo B `0.1.5-alpha.1` → `0.1.5-rc.1`) las 5 costuras de `legC` (`E1`–`E5`), o las 5 de `legD` (`D1`–`D5`; el resto de 0.2 es advisory y no se escanea). Un solo punto de entrada, para que una mitad de cliente que dejó de montarse en silencio nunca se confunda con «typecheck en verde».*

> **Repositorio oficial.** Este es el único repositorio oficial de dsh-plugin-upgrade, mantenido por PerryLink. Sustituye a los dos paquetes retirados con versión bloqueada `dsh-plugin-upgrade` (tramo A) y `dsh-plugin-upgrade-rc1` (tramo B), y es el paquete en el que se integró el corredor `0.1.5-rc.2` → `0.1.6-alpha.2` (tramo C): el nombre `dsh-plugin-upgrade-016` nunca llegó al registro. Los repositorios con el mismo nombre en otras cuentas no están afiliados. **Tanto `dsh-plugin-upgrade-015` como `dsh-plugin-upgrade-016` quedaron retirados el 2026-10-05 y no reciben más correcciones, versiones ni actualizaciones de seguridad**; toda actualización de plugins continúa aquí, y el corredor lo decide la versión que el propio repositorio destino declara, por lo que ya no hace falta un paquete con versión bloqueada por cada salto del host.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-plugin-upgrade.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-codemod/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-codemod/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-codemod?label=version)](https://github.com/PerryLink/dsh-codemod/releases)
[![npm version](https://img.shields.io/npm/v/dsh-codemod)](https://www.npmjs.com/package/dsh-plugin-upgrade)
[![npm downloads](https://img.shields.io/npm/dm/dsh-codemod)](https://www.npmjs.com/package/dsh-plugin-upgrade)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-codemod
```


</div>

---


**📖 Base de conocimiento del ecosistema** — datos medidos, no marketing: [guía de desarrollo · datos de selección · criterios de mantenimiento](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Instalación y desinstalación

```sh
dsh plugin --profile web add dsh-codemod            # desde npm
dsh plugin --profile web add github:PerryLink/dsh-plugin-upgrade   # desde el código
dsh plugin --profile web remove dsh-plugin-upgrade         # desinstalar (reversible)
```

Instalar el bundle solo registra una habilidad; quitar la fila quita la habilidad. La CLI es un destino `npx` normal y no necesita perfil.

## ⭐ 如果它帮到了你

Este plugin forma parte de la [familia de plugins DSH](https://github.com/PerryLink) (más de 40, todos Apache-2.0). Si te resulta útil, **dale una estrella**: no desbloquea nada, pero ayuda a que la siguiente persona lo encuentre antes.

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-plugin-upgrade?

Habilidad de actualización de plugins para DeepSeek Harness — un paquete, un índice de corredores, dos corredores cerrados: `0.1.3-alpha.1` → `0.1.5-rc.1` (`legAB`) y `0.1.5-rc.2` → `0.1.6-alpha.2` (`legC`).

El escáner se enruta solo: lee la banda dsh declarada por el repositorio destino (o toma `--span`) y luego aplica el catálogo propio de ese corredor, vinculado a evidencia — las 20 costuras de `legAB` (tramo A `0.1.3-alpha.1` → `0.1.5-alpha.1` más tramo B `0.1.5-alpha.1` → `0.1.5-rc.1`) las 5 costuras de `legC` (`E1`–`E5`), o las 5 de `legD` (`D1`–`D5`; el resto de 0.2 es advisory y no se escanea). Un solo punto de entrada, para que una mitad de cliente que dejó de montarse en silencio nunca se confunda con «typecheck en verde».

![Diagrama de flujo de dsh-plugin-upgrade: llamada → plugin → resultado.](docs/assets/dsh-plugin-upgrade-flow.svg)

*Resumen del flujo: llamada → plugin → resultado. Los ejemplos siguientes usan la superficie de comandos real.*


*La misma ejecución, animada.*

## Comparison

![Gráfico comparativo medido de dsh-plugin-upgrade](https://raw.githubusercontent.com/PerryLink/dsh-plugin-upgrade/main/docs/assets/dsh-plugin-upgrade-evidence.png)

40 family repos swept · README §What you get (leg A, 2026-09-09)

## Compatibilidad

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (línea actual; pins de dev/test `0.2.1-alpha.1`). El índice de corredores está ligado a la evidencia de los tramos que midió: `legAB` = `0.1.3-alpha.1 → 0.1.5-rc.1` (tag `dsh-v0.1.7-alpha.2` = `183f08e9c6dd`; relevo tramo A→B `dsh-v0.1.7-alpha.2` = `5dda764ed3aa`) `legC` = `0.1.5-rc.2 → 0.1.6-alpha.2` (tag `dsh-v0.1.6-alpha.2`), y `legD` = `0.1.6-alpha.2 / 0.1.7 → 0.2.x` (checkout `0.2.2-alpha.2`). Banda de peers `@deepseek-ai/dsh-skill >=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0`, `@deepseek-ai/cordis ^4.0.5-alpha.1`, `@deepseek-ai/schemastery ^3.18.5-alpha.1`. |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Plataformas | Donde corra Node; el escáner solo usa el sistema de archivos y es neutral respecto a la plataforma |
| Modelo | Modelos solo de texto totalmente soportados; la habilidad es un Markdown, sin requisitos de herramientas ni visión |
| Índice de corredores | Un paquete, un punto de entrada. `lib/route.mjs` contiene los corredores cerrados y la CLI enruta al que corresponde según la banda declarada del repo destino (`engines.dsh`, los rangos `@deepseek-ai/dsh*`); `--span legAB\|legC\|legD` anula la conjetura y una banda no declarada recae en el corredor más antiguo. Los tres catálogos nunca se fusionan: cada corredor conserva su propio array de costuras, tarjeta, evidencia, fixtures y puerta de paridad. |
| Alcance | **Tres corredores cerrados**: `legAB` = `0.1.3-alpha.1` → `0.1.5-rc.1` (tramo A + tramo B), `legC` = `0.1.5-rc.2` → `0.1.6-alpha.2`, `legD` = `0.1.6-alpha.2 / 0.1.7` → `0.2.x` (5 costuras escaneadas + sección advisory). Un corredor nunca se ensancha: un salto que añade una costura es un corredor nuevo — una tarjeta nueva y una fila nueva en el índice, no un paquete nuevo. |
| Tramos | Cada tramo vive en este paquete: el tramo A conserva las costuras `S1`–`S10` + `M1`, el tramo B conserva `C1`, `C2`, `C4`, `C5`, `H1`–`H4`, `P1`, y el tramo C conserva `E1`–`E5` — cada uno con su propia evidencia, sección de tarjeta, fixtures y ruta de reversión. No hay paquete hermano que instalar. |
| `C3` | Retirada: la tarjeta del tramo B escribía como `C3` el falso verde de la línea de tipos obsoleta, que es el mismo defecto que el `M1` del tramo A. La fusión queda registrada en la tarjeta; `--seams C3` no coincide con nada. |
| Paquete anterior | No montes el retirado `dsh-plugin-upgrade` en el mismo perfil: ambos registran la skill `plugin-upgrade`, así que el segundo montaje colisiona con ese nombre. Ese paquete está obsoleto en npm y su repositorio se retiró; este paquete sustituye sus dos tramos. |

## Lo que obtienes

Dos mitades, un catálogo de costuras por corredor:

- **Una habilidad de agente incluida (`plugin-upgrade`)** — la tarjeta del corredor fusionado y un bucle de arreglar-y-verificar. El cuerpo primero enruta a quien la llama al tramo que corresponde a su banda de peers; el modelo la carga solo cuando una tarea la necesita de verdad, y el paquete no aporta ningún párrafo al prompt del sistema ni registra herramientas.
- **Una CLI sin dependencias (`dsh-plugin-upgrade-scan`)** — resuelve el corredor e informa hechos `file:line` de las costuras de ese corredor: las veinte de `legAB` (`S3`, `S8`, `S9`, `M1`, `S4`, `S5`, `S6`, `S7`, `S2`, `S1`, `S10`, `C1`, `C2`, `P1`, `C4`, `C5`, `H1`, `H2`, `H4`, `H3`) releídas de los rangos de tags del harness el 2026-09-09 (tramo A) y el 2026-09-10 (tramo B), las cinco de `legC` (`E1`–`E5`) medidas en `dsh-v0.1.6-alpha.2` (2026-09-19), o las cinco de `legD` (`D1`–`D5`) releídas el 2026-11-01 contra el checkout `0.2.2-alpha.2` (`ce7073d512`) y la base `0.2.1-alpha.2` de la guía. Sale con `1` ante cualquier hallazgo de severidad error, así que entra directo en CI.

El objetivo es el modo de fallo que este corredor existe para matar: **la rotura de este lapso es mayormente silenciosa, y lo es por ambos extremos.** La línea de tipos puede estar obsoleta, así que el repo compila contra el **catálogo antiguo** (costura `M1`), y el slot de cliente desnudo `conversation` se eliminó sin alias mientras `ctx.slots.inject()` solo ejecuta su callback cuando la declaración existe: una mitad de cliente que aún lo apunta deja de montarse sin error, sin línea de log y sin build fallido (costura `C1`). Tres clases de rotura sobreviven a `typecheck` + `test`:

1. la puerta local compila una línea de tipos obsoleta — un alias `paths` antiguo, o tipos de dev/test fijados en `0.1.5-alpha.*` (costura `M1`);
2. un escritor de logs omite el campo `stream` obligatorio de V3, así que la sesión se importa y luego se niega a reanudarse (costura `S3`);
3. las pruebas están simuladas contra la forma antigua, así que pasan mientras el host descarta tu contribución (costura `C1`).

Medición honesta: el barrido del espacio de trabajo del tramo B encontró que las mitades de cliente de la familia usan solo **8** claves de slot, y las 8 sobreviven en rc.1 — para ellas la rotura de rc.1 es **latente, no real**. Los plugins de cliente de terceros que apuntaban a la clave desnuda `conversation` son los que se rompen, y lo hacen en silencio. El barrido del tramo A encontró la textura opuesta: 40 repos, 11 de ellos dieron con `M1`, y arreglar la ruta obsoleta destapó errores reales de TypeScript en 3 repos que antes estaban «en verde».

## Inicio rápido

```sh
dsh plugin --profile web add github:PerryLink/dsh-plugin-upgrade
```

```sh
# 1. instala el bundle en tu perfil
dsh plugin --profile web add dsh-codemod

# 2. verifica que la fila se montó
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-upgrade'

# 3. escanea el plugin que vas a actualizar
npx dsh-plugin-upgrade-scan --repo ../my-plugin
```

Luego pide al agente que use la habilidad `plugin-upgrade`, o lleva el bucle tú mismo con la tarjeta que corresponda a tu banda:
`skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md` (`legAB` — el tramo A es §1, el tramo B es §2, el índice de costuras fusionado es §3) o `skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md` (`legC`). El escáner elige el corredor por ti; añade `--span legC` cuando la banda declarada sea ambigua.

### Ejemplos

Son los puntos de entrada reales; instala y llama a uno.

#### Ejemplo detallado

**Comando**

~~~sh
dsh-plugin-upgrade-scan --repo fixtures/leg-a-bad-repo --seams S3
~~~

**Salida**

~~~text
# scan-0.1.5 · /mnt/d/Projects/dsh/plugins/dsh-plugin-upgrade/fixtures/leg-a-bad-repo
files scanned: 3 · hits: 1

## S3 [error] assistant/message 缺 stream（V3 必填） — 1 hit(s)
   action: 写入会话日志的 assistant/message 必须带 `stream: []`（或真实分片）；缺了导入成功但会话不可续聊（Session.fromRestore 抛 invalid settlement fields）。
   fixtures/leg-a-bad-repo/src/index.ts:30  type: 'assistant/message',

H3 [info] card-only: the rc.1 additive capabilities are listed on the version card and are never auto-detected.
~~~

*Observado en `README.md:159-173 (Surfaces/CLI); test/scan.test.mjs:158; fixtures/leg-a-bad-repo/src/index.ts:30`*

#### Rama de fallo

**Entrada**

~~~text
node scripts/scan-0.1.5.mjs --repo /nonexistent-upgrade-repo
~~~

**Salida**

~~~text
repo not found: /nonexistent-upgrade-repo
~~~

*Observado en `plugins/dsh-plugin-upgrade/lib/scan.mjs:510-514,523; plugins/dsh-plugin-upgrade/README.md:181-192`*

#### Ejemplos breves

- `plugin-upgrade`

## Configuración

Cada clave es opcional y vive en el patch del perfil:

| Clave | Por defecto | Significado |
|---|---|---|
| `enabled` | `true` | Registra la habilidad incluida. Pon `false` para mantener la dependencia montada pero en silencio. |
| `skillName` | `plugin-upgrade` | Directorio bajo `skillsRoot` que se registra, y el nombre que aparece en el catálogo. |
| `skillsRoot` | el `./skills` del propio paquete | Dónde vive `<skillName>/SKILL.md`. Apúntalo a tu propia tarjeta para reutilizar la infraestructura. |
| `userInvocable` | `true` | Si una persona puede invocar la habilidad por nombre además del modelo. |

```yaml
- insert:
    - id: dsh-plugin-upgrade
      name: dsh-plugin-upgrade
      config:
        skillName: plugin-upgrade
```

El plugin monta de forma ruidosa: un `SKILL.md` ausente, un cuerpo vacío o un frontmatter sin `name` hacen fallar el montaje en lugar de registrar una habilidad vacía.

## Superficies

**Habilidad** — `plugin-upgrade` (invocable por el modelo y por personas por defecto). Cuerpo: la tabla de enrutado por tramo, las 8 reglas duras y el bucle de 6 pasos. Referencias: la tarjeta del corredor fusionado. Scripts: el detector, dentro del directorio de la habilidad para que las rutas relativas resuelvan.

**CLI** — `dsh-plugin-upgrade-scan`:

```sh
dsh-plugin-upgrade-scan [--repo <path>] [--span legAB|legC|legD|<span>] [--json <out.json>] [--seams S3,C1,P1] [--quiet]
```

| Bandera | Significado |
|---|---|
| `--repo <path>` | Repositorio a escanear (por defecto: el directorio actual). Su banda dsh declarada elige el corredor. |
| `--span legAB\|legC\|legD\|<span>` | Fuerza un corredor en lugar de conjeturarlo desde la banda declarada. Una banda desconocida recae en `legAB`. |
| `--json <out.json>` | También escribe el informe legible por máquina (`repo`, `scannedAt`, `files`, `hits[]`, `bySeam`). |
| `--seams S3,C1,P1` | Restringe a costuras concretas del catálogo del corredor resuelto (los ids nunca se comparten entre corredores). |
| `--quiet` | Suprime la salida humana (combínala con `--json`). |

Códigos de salida: `0` sin hallazgos de severidad error · `1` al menos un hallazgo de severidad error · `2` uso o fallo del escaneo. Un escaneo limpio es necesario pero no suficiente: el criterio de salida es un smoke real en el host, más un ida y vuelta de reanudación para los escritores de logs (tramo A) y una aserción en un navegador real para la mitad de cliente (tramo B).

## Las veinte costuras de `legAB`

El orden sigue el catálogo de `lib/scan.mjs` (primero el tramo A, luego el tramo B), que es también el orden al que `test/card.test.mjs` fija la tarjeta.

| Id | Severidad | Qué cambió en el camino a `0.1.5-rc.1` |
|---|---|---|
| `S3` | error | `assistant/message` ganó un campo `stream` obligatorio (formato de sesión V3): un log escrito sin él se importa con éxito y luego se niega a reanudarse (`Session.fromRestore` lanza `invalid settlement fields`). |
| `S8` | error | `SessionHandle.read()` devuelve `SessionHandleReadResult` (`{ eventState, events }`) en lugar del array de eventos; las operaciones de array deben desenvolver `.events`. |
| `S9` | error | La configuración de `SystemPrompt` renombró `persona` → `personaPrefix` / `personaSuffix`. Sustituirlo por `includeHarnessIdentity: false` **no** es equivalente: elimina el bloque de identidad del harness. |
| `M1` | error | La puerta local compila una línea de tipos obsoleta: tipos de dev/test fijados en `0.1.5-alpha.*`, o un alias `paths` de `tsconfig` que resuelve a un directorio de checkout inexistente, hacen que TypeScript vuelva en silencio a los tipos publicados. Puerta en verde, regla equivocada. |
| `S4` | error | `tool/code-dispatch` pasó a llamarse `tool/ptc-dispatch`; la etiqueta antigua ya no se reconoce en las sesiones V3. |
| `S5` | error | `ctx.agent` se eliminó: quien llama debe pasar el Agent explícitamente (por ejemplo, el segundo parámetro de `setup(agentCtx, agent)`). |
| `S6` | error | `Inbox` es una interfaz de tipo, no una clase construible; los fixtures usan la forma oficial no soportada y el código en tiempo de ejecución lee `agent.inbox`. |
| `S7` | warn | `SubprocessHandle.pid` se eliminó (solo queda `SubprocessTerminalHandle.pid`); quita el campo de los fixtures de prueba. |
| `S2` | warn | `EpochHeader.system` se eliminó: el prompt del sistema es ahora el `system/message` del nodo 0 de la superficie. |
| `S1` | warn | Formato de sesión V3 y nombres de log con sufijo de generación: la generación actual es `session.v3.jsonl.zstd`, así que los scripts que fijan `session.jsonl.zstd` fallan en silencio. |
| `S10` | warn | Los eventos de sesión escritos por un plugin deben pasar por la puerta de adaptación fail-closed del host: `Session.append` no tiene canal de escritura `ignorable`, así que un append incondicional puede dejar una sesión ilegible. |
| `C1` | error | El slot de cliente desnudo `conversation` se eliminó y se sustituyó por `main` + `main.conversation`, **sin alias**. `ctx.slots.inject()` solo se dispara si la declaración existe, así que un plugin que lo apunta deja de montarse **en silencio**. |
| `C2` | error | `@deepseek-ai/dsh-client-ui-sidebar-textpreview` pasó a llamarse `…-sidebar-documentpreview`; el nombre antiguo desapareció y no hay paquete shim. |
| `P1` | error | La banda de peers debe conservar su segundo segmento: `>=0.1.2-rc.1 <0.2.0` por sí solo **rechaza** `0.1.5-rc.1` bajo la regla prerelease-tuple de npm semver (medido `false` en semver 7.8.5). |
| `C4` | warn | rc.1 añadió un modelo de panel principal global (`main`, `sidebar.panellist`, `ctx.layout.selectPanel(MainPanelId \| null)`) y añadió la prop estándar `usePanelInfo` a casi todos los slots. |
| `C5` | warn | La vista previa de documentos se movió al slot con clave `sidebar.right.tab.document` (`DocumentContent`); `sidebar.right.pane.tab` sobrevive pero su entrada padre pasó a ser `rightbar.session`. |
| `H1` | warn | `KNOWN_SESSION_EVENT_TYPES` ganó `deliverables/presented` y `subagent/catalog`: el vocabulario fail-closed creció. |
| `H2` | warn | La fila de la nueva herramienta `present` ocupa la clave `'present'` de `tool.call.toolview`, que en alpha.1 estaba libre. |
| `H4` | info | El catálogo asesor por defecto del adaptador DeepSeek ahora encabeza con `deepseek-flash` (DeepSeek-V41-Flash). |
| `H3` | info | Nuevas capacidades opcionales: `ctx.sessionFeedback`, `ctx.layout.beginNavigation()`, `ctx.workspaces.openSession()` / `openWorkspace()` / `forkSession()`. Listadas en la tarjeta; deliberadamente sin detección automática. |

`S7`, `S2`, `S1`, `S10`, `C4`, `C5`, `H1`, `H2` y `H4` son deliberadamente asesorables: tienen coincidencias legítimas (un repo que ya usa la API nueva, una instantánea de documentación, la tabla de ids de modelo de un plugin, un `ChildProcess.pid` de Node), así que el escáner las reporta como pistas para revisión manual, no como fallos. `M1` y `P1` son comprobaciones **estructurales** — resuelven `package.json` y `tsconfig*.json` en lugar de coincidir texto — y `H3` es **solo de tarjeta**: documentada, con paridad de ids comprobada y deliberadamente sin detector (`CARD_ONLY = ['H3']`).

## Las cinco costuras de `legC` (`0.1.5-rc.2` → `0.1.6-alpha.2`)

El orden sigue el catálogo de `lib/scan-0.1.6.mjs`, que es también el orden al que `test/card.test.mjs` fija la tarjeta de `legC`. Aquí toda costura es `error` y todas se detectan (`CARD_ONLY = []`).

| Id | Severidad | Qué cambió en el camino a `0.1.6-alpha.2` |
|---|---|---|
| `E1` | error | `agent/created` despacha sus listeners en serie: un listener que lanza — o que hace trabajo lento — bloquea por completo la creación del agente. Envuelve el trabajo síncrono en `try`/`catch` y aplaza el resto con `queueMicrotask`/`setImmediate` o tu propia cola. |
| `E2` | error | Un `apply()` asíncrono cuyo primer `await` precede a sus registros: todo lo registrado después cae en la ventana de descarga y lanza `INACTIVE_EFFECT`, mientras el cierre antiguo sigue corriendo. Registra todo antes del primer `await`, dentro de un único `ctx.effect()`. |
| `E3` | error | Claves de slot/estado eliminadas: `settings.plugin.item` pasó a ser el keyed→list `plugins.item`, y `SessionListState.current` desapareció — una tarjeta de ajustes desaparece **en silencio** (retorno temprano por `spec === undefined`), y los casts de `current` siguen compilando mientras la función está muerta. |
| `E4` | error | API de cliente eliminada: `sessions.open` / `openSubagent` / `clear` pasaron a `retain` / `using` / `retainInfo`. |
| `E5` | error | Literales de modelo eliminados: `deepseek-v4-flash*` y `deepseek-v4-vision-exp`. El catálogo de modelos por defecto se encogió de 4 a 2, y un id sin catalogar pasa tal cual como solo texto. |

Se aplica la misma disciplina que en `legAB`: un escaneo limpio es necesario, no suficiente. La rotura de `legC` es silenciosa o solo en tiempo de ejecución (la línea de tipos publicada oculta las eliminaciones), así que el criterio de salida sigue siendo un smoke real en el host sobre un `DSH_HOME` temporal, más el ida y vuelta del escritor de logs y la aserción en navegador real donde correspondan.

## Lo que esto no cubre

- **Un salto más allá de todos los corredores de aquí.** `legAB` termina en `0.1.5-rc.1` por construcción: el salto del harness `0.1.5-rc.1` → `0.1.5-rc.2` no añadió ninguna costura de cara a los plugins (el pin de dev/test de este propio paquete corre ahora sobre la línea `0.1.7-rc.2`, de modo que el catálogo queda verificado contra esos tipos publicados; la sonda del workflow compat sigue anclada en `0.1.6-alpha.2`), y `legC` cubre `0.1.5-rc.2` → `0.1.6-alpha.2`. Un salto posterior que añada una costura **no** está cubierto: un corredor está cerrado, y ensanchar una tarjeta es peor que añadir una. Ese salto recibe una tarjeta nueva y una fila nueva en el índice — no un paquete nuevo.
- **El salto `0.1.1` → `0.1.2`.** Usa la habilidad de convergencia de la comunidad.
- **Repetir entre tramos.** El tramo A posee las costuras del formato de sesión (`assistant/message.stream`, `SessionHandleReadResult`, `EpochHeader.system`, `ctx.agent`, `Inbox`, `SystemPrompt.persona`, la generación de log V3) y el tramo B no las repite: todo el diff de `packages/core/session/src` en el rango del tramo B son dos literales de tipo de evento añadidos y una línea de comentario. La sección de tarjeta de cada tramo conserva su propia declaración de alcance.
- **La ruta de actualización del usuario de DSH.** Este paquete actualiza *código fuente de plugins*, no la instalación del harness de un usuario.
- **Tokens de tema.** `docs/web-styling.md` no tiene ningún cambio en el rango del tramo B.
- **Prueba.** Un escaneo limpio es una hipótesis. El criterio de salida es un smoke real en el host (`DSH_HOME` temporal, CLI objetivo, `plugin add <tarball>`, `--dump-config`) más un ida y vuelta de reanudación para los escritores de logs de sesión (tramo A) y una aserción en un navegador real para cada hallazgo del lado cliente (tramo B).

## Límites de seguridad

- **Escaneo de solo lectura.** La CLI nunca escribe dentro del repositorio escaneado; `--json` escribe solo en la ruta que indiques.
- **Sin red, sin shell.** El escáner no importa nada fuera de la biblioteca estándar de Node y nunca lanza un proceso.
- **Sin secretos.** Nada en el paquete lee credenciales, tokens de entorno ni datos de sesión.
- **Receta de smoke en sandbox.** La comprobación de host real de la tarjeta usa un `DSH_HOME` de `mkdtemp`; nunca toca tu `~/.dsh` real.

## Desarrollo

```sh
npm install                        # o: pnpm install (el repo incluye pnpm-lock.yaml)
npm test                           # node --test: escáner, paridad tarjeta<->catálogo, Cordis + SkillRegistry reales
npm run verify:self-contained      # cada import resuelve dentro del paquete
npm run verify:artifacts           # el tarball lleva la habilidad, la CLI y el patch, y excluye las pruebas
npm run check:readmes              # consistencia de los README en cinco idiomas
npm pack
```

El escáner tiene un par de fixtures sintéticos **por tramo de `legAB`**: `fixtures/leg-a-bad-repo` (las costuras de sesión/configuración del tramo A, con todas las costuras de error presentes a propósito) junto con `fixtures/leg-a-good-repo` (adaptado), y `fixtures/bad-repo` (las costuras de slot de cliente del tramo B) junto con `fixtures/good-repo` (adaptado) — más un negativo en vivo sobre un repositorio de la familia ya fijado a `0.1.5-rc.1`, de modo que una regresión del catálogo falla en esta suite y no en un usuario aguas abajo. `test/card.test.mjs` afirma que el índice de cada tarjeta y su propio catálogo (`lib/scan.mjs` para `legAB`, `lib/scan-0.1.6.mjs` para `legC`) nombran **exactamente** los mismos ids de costura con las mismas severidades, que el `CARD_ONLY` de `legAB` es exactamente `['H3']` mientras el de `legC` está vacío, y que los dos catálogos no comparten ningún id de costura — la regla de vinculación de evidencia como puerta de máquina, por corredor.

## Temas

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `plugin-upgrade`, `migration`, `skill`, `version-card`, `scanner`, `client-slots` (reflejan las `keywords` de `package.json`; `dsh-plugin` es el canal de visibilidad del ecosistema).

## Licencia

Apache-2.0 — consulta [LICENSE](LICENSE). Las dependencias de instalación y sus licencias están en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); no se incluye nada empaquetado.


## PerryLink DSH Plugin Family

Este proyecto forma parte de la familia de plugins de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro permanece plegado abajo para que cada README conserve una primera pantalla corta; expándelo para ver cada fila y su estado.

<details>
<summary>Expandir todos los plugins</summary>

| Plugin | Estado |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-codemod)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver el README del repositorio |

</details>
