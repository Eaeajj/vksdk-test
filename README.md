# Привет! Это песочница с демкой встраивания виджета мессенжера ч-з @vkontakte/superappkit


### Создание миниапа

Дополнительная документация: [https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/create-application](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/create-application)

Для создание миниапа используется ресурс [https://id.vk.com/about/business/go](https://id.vk.com/about/business/go)

(предварительно необходимо войти в [https://id.vk.com/](https://id.vk.com/))

Необходимо:

1. Кликаем "Добавить приложение"
2. Регистрация приложения - Шаг 1 Заполняем поля:
   1. Платформа - web
   2. Название, изображение  - на свой вкус
3. Регистрация приложения - Шаг 2 Заполняем поля:
   1. Базовый домен вашего сайта
      *Если вы хотите, чтобы использовались поддомены,*
      *необходимо поставить в начале базового домена*
      *точку (например, .[mysite.com](http://mysite.com/)). Вы также можете*
      *указать несколько доменных имен, если есть*
      *необходимость использовать один APP_ID*
      *на разных доменах.
      Важно: для разработки и отладки вам возможно потребуется настроить проксирование с локальной машины на домен который вы укажите, для корректной авторизации на локальной машине.*
   2. Доверенный Redirect URL
      *URL, на который будет переадресован браузер
      пользователя после нажатия кнопки «Войти как».
      Важно указать адрес, если вы используете схему
      авторизации Connect.redirectAuth*
4. Кликаем Готово
5. После того как приложение будет создано, необходимо передать ID приложения Юлии Емельяненко (@juli_emelyan - telegram) С пометкой "Минапп для виджета ВК Мессенжер в <Ваше название>"
6. Вы великолепны!

### Внедрение виджета

#### Backend

Дополнительная документация: [https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/tokens/superapp-token](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/tokens/superapp-token)

В качестве примера использовался стек vite, nodejs, express

**index.js**

superapp_token2.js, superapp_token.js - Пример имплементации SuperApp token на Node.js

Запуск бека: yarn dev-back

#### Frontend

MessengerEdu.ts - Надстройка над мессенджером, где удаляется проверка на peer_id и добавляется новый методы для открытия мессенджера с нужным peer_id

**MessengerEdu.ts**

useAuth.ts - Конфигурирование superappkit для выполнения авторизации

useMessenger.tsx - инициализация виджета (см демо с настройками [https://id.vk.com/about/business/demo/#/messenger](https://id.vk.com/about/business/demo/#/messenger))

App.tsx - UI  запуска авторизации и виджета

**App.tsx**

Запуск фронта: yarn dev
