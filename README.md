<a href="https://hack-it-out.vercel.app/en">
  <img alt="Healthify App" src="https://hack-it-out.vercel.app/en/opengraph-image.jpg">
  <h1 align="center">Healthify Web App</h1>
</a>

<p align="center">
  A web app using Next.js implementing a voice AI that answers patient questions, and provides basic health information in regional language.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-used"><strong>Model Used</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Features

- Health Platform: Seamless Next.js App for remote healthcare.
- AI-Powered Healthcare: Utilizes LLM's engineered with LangChain, for advanced AI analysis.
- Edge Runtime-Ready: Ensures computation in regions close to You
- Modern UI Design: Stylish UI with Tailwind CSS and lucide Icons.

## Model Used

This App runs with OpenAI `gpt-3.5-turbo`. We are also trying to develop using langchain and local llm's like Llama for better output generation.

## Running locally

1. Clone & create this repo locally with the following command:

```bash
git clone https://github.com/abhinandarun-02/healthify.git
```

2. Install dependencies using npm:

```bash
npm install
```
3. Copy `.env.example` to `.env` and update the variables.

```sh
cp .env.example .env.local
```
4. Start the development server:
```bash
npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Authors

This web-app is created as part of [Voice AI Hackathon](https://unstop.com/hackathons/voice-ai-hackathon-daasdevelopers-as-a-service-842943) conducted by DaaS (Developers as a Service).

- [Abhinand Arun](https://github.com/abhinandarun-02)
- [Arun Govind M](https://github.com/arungovindm2001)
- [Advait Dev Krishnan](https://github.com/)