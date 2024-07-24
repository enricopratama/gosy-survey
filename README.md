<p align="center">
    <a href="https://laravel.com" target="_blank">
        <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400">
    </a>
</p>

# GONUSA SURVEY GENERATOR SYSTEM
This repository is for a web application built with Laravel as the backend framework and React.js for the frontend. The project aims to provide a robust foundation for developing modern web applications with a clear separation of concerns and an efficient development workflow.

## Dependencies (Potential Package Conflicts)
- Uses React Bootstrap
- Uses Prime React
- Depends on public/modern/assets to work for HTML

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Install PHP dependencies:**

    Ensure you have [Composer](https://getcomposer.org/) installed and run:

    ```sh
    composer install
    ```

3. **Install JavaScript dependencies:**

    Ensure you have [Node.js](https://nodejs.org/) installed and run:

    ```sh
    npm install
    ```

4. **Set up your environment variables:**

    Copy the `.env.example` file to `.env` and configure your database and other environment variables:

    ```sh
    cp .env.example .env
    php artisan key:generate
    ```

5. **Run database migrations:**

    Ensure your database is configured correctly in the `.env` file, then run:

    ```sh
    php artisan migrate
    ```

6. **Compile assets:**

    Compile your assets using Laravel Mix:

    ```sh
    npm run dev
    ```
7. **Running the application:**

    Compile your Laravel Development Server:
   
    ```sh
    php artisan serve
    ```

    Start the React Development Server:
    ```sh
    npm run watch
    ```

   
   

## Configuration

Ensure your `.env` file is set up correctly. Here is an example of the critical parts:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:UmFL77zPzklDZJ0/vHWAu+QfAWrslKAn3430oIqXTwQ=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gpd_gsurvey_dev
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

