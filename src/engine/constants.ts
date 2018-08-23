export var imageFiles = {
    enemies: '../assets/mario-enemies.png',
    sprites: '../assets/mario-sprites.png',
    objects: '../assets/mario-objects.png',
    peach: '../assets/mario-peach.png',
    landscapes: '../assets/landscapes/'
}

export var setup = {
    marioScreenOffset: 0.34,
    square_size: 32,
    jumping_v: -15,
    walking_v: 4,
    gravity: 1,
    overlap: 7
}

export enum GroundBlocking {
    none = 0,
    left = 1,
    top = 2,
    right = 4,
    bottom = 8,
    all = 15,
}

export enum CollisionType {
    head = 0,
    feet = 1,
    left = 2,
    right = 3
}

export enum Direction {
    none = 0,
    left = -1,
    up = 2,
    right = 1,
    down = 4,
}
