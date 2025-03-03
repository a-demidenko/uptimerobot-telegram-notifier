# Uptime Robot telegram notifier | Уведомления в телеграм от Uptime Robot

[![Uptime Robot](https://img.shields.io/badge/Uptime%20Robot-Monitoring-32B90E)](https://uptimerobot.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020)](https://workers.cloudflare.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-0088cc)](https://core.telegram.org/bots/api)

*Read this in: [🇬🇧 English](#english-version) | [🇷🇺 Русский](#русская-версия)*

---

## English Version

- [Introduction](#introduction)
- [Features](#features)
- [Setup Guide](#setup-guide)
  - [1. Creating a Telegram Bot](#1-creating-a-telegram-bot)
  - [2. Setting up Cloudflare Worker](#2-setting-up-cloudflare-worker)
  - [3. Configuring Email Routing](#3-configuring-email-routing)
  - [4. Testing the Solution](#4-testing-the-solution)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)

### Introduction

This project allows you to receive Uptime Robot notifications directly in your Telegram chat. It uses Cloudflare Workers to process email notifications from Uptime Robot and forward them to Telegram with proper formatting and status indicators.

### Features

- ✅ Converts Uptime Robot email alerts to Telegram messages
- 🔔 Instant notifications about service status changes
- 🌐 Supports UP/DOWN status with visual indicators
- 📋 Preserves detailed information from the original alert
- ☁️ Serverless implementation using Cloudflare Workers
- 🔒 Secure handling of sensitive information

### Setup Guide

#### 1. Creating a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot` command
3. Follow the instructions to create your bot:
   - Provide a name for your bot
   - Provide a username ending with "bot"
4. Save the API token provided by BotFather (looks like `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)
5. Start a chat with your new bot or add it to a group
6. To get your chat ID:
   - Send a message to the bot
   - Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - Look for the `"chat":{"id":` value in the response

#### 2. Setting up Cloudflare Worker

1. Sign in to your [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Navigate to Workers & Pages
3. Click "Create a Worker"
4. Give your worker a name (e.g., `uptime-telegram-notifier`)
5. Replace the default code with the provided worker code
6. Click "Save and Deploy"
7. Go to the "Settings" tab of your worker
8. Under "Variables", add the following secrets:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_CHAT_ID`: Your Telegram chat ID

#### 3. Configuring Email Routing

1. In Cloudflare dashboard, go to "Email Routing"
2. Enable Email Routing if not already enabled
3. Create a new routing rule:
   - Add a custom address (e.g., `uptime@yourdomain.com`)
   - Select "Send to Worker" and choose your worker
4. Update your Uptime Robot settings to send alerts to this email address

#### 4. Testing the Solution

1. In Uptime Robot, go to your monitor settings
2. Temporarily change the monitoring URL to trigger a DOWN alert
3. Check your Telegram chat for the notification
4. Restore the correct URL to receive an UP notification

### How It Works

1. Uptime Robot detects a status change in your monitored service
2. It sends an email notification to your Cloudflare Email Routing address
3. Cloudflare routes this email to your Worker
4. The Worker:
   - Extracts the subject and body from the email
   - Parses the status (UP/DOWN)
   - Formats a Telegram message with appropriate emoji
   - Sends the message to your Telegram chat via Bot API

### Troubleshooting

- **No messages in Telegram**: Verify your bot token and chat ID
- **Worker errors**: Check the Cloudflare Worker logs
- **Email not reaching Worker**: Verify your Email Routing configuration
- **Malformed messages**: Ensure the Worker code handles the email format correctly

---

## Русская версия

- [Введение](#введение)
- [Возможности](#возможности)
- [Руководство по настройке](#руководство-по-настройке)
  - [1. Создание Telegram бота](#1-создание-telegram-бота)
  - [2. Настройка Cloudflare Worker](#2-настройка-cloudflare-worker)
  - [3. Настройка маршрутизации электронной почты](#3-настройка-маршрутизации-электронной-почты)
  - [4. Тестирование решения](#4-тестирование-решения)
- [Как это работает](#как-это-работает)
- [Устранение неполадок](#устранение-неполадок)

### Введение

Этот проект позволяет получать уведомления от Uptime Robot непосредственно в вашем Telegram чате. Он использует Cloudflare Workers для обработки email-уведомлений от Uptime Robot и пересылки их в Telegram с правильным форматированием и индикаторами статуса.

### Возможности

- ✅ Преобразует email-оповещения Uptime Robot в сообщения Telegram
- 🔔 Мгновенные уведомления об изменениях статуса сервисов
- 🌐 Поддерживает статусы UP/DOWN с визуальными индикаторами
- 📋 Сохраняет детальную информацию из исходного оповещения
- ☁️ Бессерверная реализация с использованием Cloudflare Workers
- 🔒 Безопасная обработка конфиденциальной информации

### Руководство по настройке

#### 1. Создание Telegram бота

1. Откройте Telegram и найдите `@BotFather`
2. Начните чат и отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота:
   - Укажите имя для вашего бота
   - Укажите имя пользователя, заканчивающееся на "bot"
4. Сохраните API токен, предоставленный BotFather (выглядит как `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)
5. Начните чат с вашим новым ботом или добавьте его в группу
6. Чтобы получить ID чата:
   - Отправьте сообщение боту
   - Посетите `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
   - Найдите значение `"chat":{"id":` в ответе

#### 2. Настройка Cloudflare Worker

1. Войдите в [панель управления Cloudflare](https://dash.cloudflare.com/)
2. Перейдите в раздел Workers & Pages
3. Нажмите "Create a Worker"
4. Дайте воркеру имя (например, `uptime-telegram-notifier`)
5. Замените код по умолчанию предоставленным кодом воркера
6. Нажмите "Save and Deploy"
7. Перейдите на вкладку "Settings" вашего воркера
8. В разделе "Variables" добавьте следующие секреты:
   - `TELEGRAM_BOT_TOKEN`: Ваш токен Telegram бота
   - `TELEGRAM_CHAT_ID`: ID вашего Telegram чата

#### 3. Настройка маршрутизации электронной почты

1. В панели управления Cloudflare перейдите в "Email Routing"
2. Включите Email Routing, если он еще не включен
3. Создайте новое правило маршрутизации:
   - Добавьте пользовательский адрес (например, `uptime@yourdomain.com`)
   - Выберите "Send to Worker" и укажите ваш воркер
4. Обновите настройки Uptime Robot для отправки оповещений на этот email-адрес

#### 4. Тестирование решения

1. В Uptime Robot перейдите к настройкам вашего монитора
2. Временно измените URL мониторинга, чтобы вызвать оповещение DOWN
3. Проверьте ваш Telegram чат на наличие уведомления
4. Восстановите правильный URL, чтобы получить уведомление UP

### Как это работает

1. Uptime Robot обнаруживает изменение статуса вашего сервиса
2. Он отправляет email-уведомление на ваш адрес Cloudflare Email Routing
3. Cloudflare направляет это письмо вашему воркеру
4. Воркер:
   - Извлекает тему и содержимое из письма
   - Анализирует статус (UP/DOWN)
   - Форматирует сообщение Telegram с соответствующим эмодзи
   - Отправляет сообщение в ваш Telegram чат через Bot API

### Устранение неполадок

- **Нет сообщений в Telegram**: Проверьте токен бота и ID чата
- **Ошибки воркера**: Проверьте логи Cloudflare Worker
- **Email не доходит до воркера**: Проверьте настройки Email Routing
- **Некорректное форматирование сообщений**: Убедитесь, что код воркера правильно обрабатывает формат email

---

## Keywords / Ключевые слова

Uptime Robot, Monitoring, Telegram Bot, Cloudflare Worker, Email Routing, Notifications, Service Status, Uptime Monitoring, Server Monitoring, Alert System, Мониторинг серверов, Уведомления о статусе, Оповещения в Telegram, Бот для мониторинга, Облачные воркеры, Маршрутизация почты
