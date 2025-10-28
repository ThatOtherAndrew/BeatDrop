# BeatDrop!

Make music with physics!

[Try out BeatDrop!](https://thatotherandrew.github.io/BeatDrop/)

## How to use

Click on the canvas to spawn **bricks** which play musical notes when hit, and **balls** which fall and hit the bricks.

### Controls

**Click:** Place a ball or brick
**Left/Right arrow keys:** Switch between ball and brick placement mode
**Scroll up/down:** Change the pitch of the next brick to be placed
**Shift + scroll:** Rotate the next brick to be placed

## Development

If you're using [Nix](https://nixos.org/), enter the development shell with:
```
nix develop
```

To set up the development environment with [`bun`](https://bun.com/), clone the repository and install dependencies:

```bash
git clone https://github.com/ThatOtherAndrew/BeatDrop
cd BeatDrop
bun install
```

To start the development server, run:

```bash
bun dev
```
