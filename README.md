![Blackmail](https://github.com/user-attachments/assets/1959a687-e8d1-4188-8d68-370518186f7c)

## About Blackmail

A questionable SMTP server.

## Disclaimer

This software is not intended for spam, harassment, or any illegal activity.
It was created solely for creative and artistic expression.

- Do not use this software to send unsolicited emails.
- Never use an email address without the recipient’s explicit approval.
- The author assumes no responsibility for misuse of this project.

## Setup

### Create configuration file

Copy `config.json.example` to `config.json` and update with your settings:

```bash
cp config.json.example config.json
```

Edit `config.json` with your SMTP configuration and recipient list:

```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "username": "your-email@gmail.com",
    "password": "your-app-password"
  },
  "recipients": [
    "recipient1@example.com",
    "recipient2@example.com"
  ],
}
```

## Pull from docker

```bash
docker run --rm -v $(pwd)/config.json:/app/config.json pointlesscode/blackmail:latest
```

## Build it yourself
- clone the project and cd to folder
- build and run the image
```bash
docker build -t blackmail .

docker run --rm -v $(pwd)/config.json:/app/config.json blackmail
```

## Social

<a href="https://pointlesscode.dev/">.less</a><br>
<a href="https://www.instagram.com/pointlesscode">Instagram</a><br>
<a href="https://x.com/pointlessCodes">Twitter</a><br>
<a href="https://github.com/pointless-code">GitHub</a><br>
<a href="https://hub.docker.com/u/pointlesscode">DockerHub</a>

## License

The project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).