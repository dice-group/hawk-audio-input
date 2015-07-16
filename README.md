# HAWK Audio Input

This project is a Web App for the [HAWK](https://github.com/AKSW/HAWK) question answering framework. Using the website it is possible to either enter your question with your keyboard or simple use your voice

## Installation

The app is written in Ruby using Sinatra, Sass and haml. The server side speech recognition uses [CMU Pocketsphinx](https://github.com/cmusphinx/pocketsphinx) and [Festival](http://www.cstr.ed.ac.uk/projects/festival/) as TTS service.

The following instructions show how to setup the app on Ubuntu 14.04

##### 1. Install requirements

```bash
sudo apt-get install git automake autoconf curl sox libsox-dev libtool bison python-dev python-pip swig git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev libsamplerate0-dev libsamplerate0
```

##### 2. Install Ruby

If you don't have Ruby installed I recommend using [rbenv](https://github.com/sstephenson/rbenv)

```shell
git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

rbenv install 2.2.0
gem install bundler --no-ri --no-rdoc
```

##### 3. Compile Sphinxbase and Pocketsphinx

The versions of pocketsphinx shipped by Ubuntu are out of date so you will have to build them on your own

```shell
git clone https://github.com/cmusphinx/sphinxbase /tmp/sphinxbase
cd /tmp/sphinxbase
./autogen.sh
./configure
make
sudo make install


git clone https://github.com/cmusphinx/pocketsphinx /tmp/pocketsphinx
cd /tmp/pocketsphinx
make clean all
sudo make install
```

##### 4. Clone the app

```shell
git clone https://github.com/hawk/hawk-audio-input
cd hawk-audio-input
bundle install
```

##### 5. Start

Inside the app folder run:

```shell
bundle exec rackup
```

And visit [127.0.0.1:9292]()
