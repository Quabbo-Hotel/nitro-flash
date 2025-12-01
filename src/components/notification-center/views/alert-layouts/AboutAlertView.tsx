import React, { useEffect, useRef, useState } from "react";
import { NitroCardView } from '../../../../common';


interface AboutAlertViewProps {
  item: {
    username: string;
    version: string;
    onlineUsers: string;
    activeRooms: string;
    uptime: string;
    ramUsage: string;
    cpuCores: string;
    totalMemory: string;
    hotelName: string;
  };
  onClose: () => void;
}

const randomChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?/|";

const hotelLogo = `
⠀⠀⠀⠀⠀⠀⠀⠄⣀⠢⢀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⡔⢀⠂⡜⢭⢻⣍⢯⡻⣝⣿⣿⡿⣟⠂
⠀⠀⠀⠀⠀⠀⠀⠄⠀⣦⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡔⡀⢂⠜⣪⢗⡾⣶⡽⣾⣟⣯⠛⠀⠀
⠀⠀⠀⠀⠀⠄⠀⠠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣔⠨⡸⡝⣯⣳⢏⣿⠳⠉⠀⢠⣬⡶
⠠⣓⢤⣂⣄⣀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠁⣞⡱⣝⠎⠀⢀⠠⣥⠳⡞⡹
⠀⡄⢉⠲⢿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡔⣧⡽⠋⠀⣰⣶⣻⣶⣿⢾⣷
⢤⡈⠉⠲⢤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢀⡴⢏⡳⢮⡿⣽⣞⠻⡜
⠒⣭⠳⢶⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡙⠮⣜⣯⡽⣳⢌⡓⠈
⡸⣰⢋⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣻⢿⣻⣿⡽⣗⠋⠄⠀
⠣⢇⢟⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢟⡿⢣⣟⡻⠘⠀⠀⠀
⠱⡊⠤⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠨⠗⠋⣁⣤⠖⠊⢁⣀
⠀⠁⠂⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⣿⡂⠹⣿⣿⣿⣿⣿⠙⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠒⢋⣉⡤⣔⣮⣽⣾
⢢⠣⣌⢼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⢰⣿⡅⠀⣿⣿⣿⣿⣿⠀⠸⢿⣹⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣻⣿⣿⣿⣿⣿⣿⣿
⢃⡉⠠⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣼⢹⠀⠀⠀⠀⣾⠿⡇⠀⣿⣿⣿⣿⡏⠀⠀⣞⣧⣻⠟⢿⣿⣿⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣧⠱⣌⣳⣽⣻⣿⣿⣻
⠀⢒⡕⣺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⡇⠈⣇⠀⠀⠀⠈⡆⢳⠀⠇⡟⠋⠉⠀⠀⠀⠃⢙⣠⣤⣤⣼⣯⣚⣟⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠌⠑⠌⢳⠛⡛⠏⠛⠉
⡘⢷⣌⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠉⢻⣀⣧⣤⣽⣦⣤⣄⠀⠰⡀⠃⠀⠀⠀⠀⠀⠀⡴⠟⠛⣉⣉⡉⠉⠈⠉⠉⠉⠋⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢈⠈⠈⠁⠛⠀⠀⠀⣒
⠉⢣⡛⣿⣿⣿⣿⣿⣿⣿⣿⣿⡧⠖⠛⠉⠉⠉⠀⠀⠐⠒⢢⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⣠⣲⣾⣿⢿⣷⢶⡄⠀⠀⣽⣿⣿⣿⣿⡿⠟⣿⣿⣿⣿⣿⠛⢁⣤⡶⠿⠛⠋
⠀⠀⠌⢽⣿⣿⣿⣿⣿⣿⣿⣿⡷⠀⠀⠀⣠⣶⣶⣿⣟⣿⣶⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⢿⣿⣿⣿⣿⠀⣿⡀⠀⢻⣬⣙⡻⡿⣡⣾⣿⣿⡍⠈⣀⣤⣬⣤⣶⣲⣶⣿
⠀⢈⠐⡀⢻⣫⢿⣿⣿⣿⣿⠘⢧⠁⠀⣻⡏⠸⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⢄⣉⣛⣋⣡⡴⠃⠀⠀⣿⣿⣿⠟⣠⡛⢿⣿⣿⣷⣲⣽⣿⣿⣷⣾⣷⣿⣿
⠀⠀⢀⠐⡀⢃⡈⣿⢿⣿⣿⣟⡆⠀⠀⠉⠿⣦⣈⣉⣉⠤⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡟⣡⣶⣿⣿⣾⣿⣿⣿⢿⡿⣿⣿⡿⠿⠛⣋⣡
⠠⠐⡀⢢⣶⣿⢧⠻⣯⣿⣯⡛⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠘⠐⠂⡁⠤⠔⢂⣉⣤⡴
⣀⠥⠌⣳⢯⣟⣮⣗⣾⣟⣿⣿⣦⣭⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠂⣈⠥⡔⡤⣍⠣⣝⢾⡹
⠀⠀⠀⠠⠈⠉⠈⠉⠉⠉⣨⣿⣿⣿⣯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⡟⠻⢞⣿⣝⣳⢎⢳⢻⡮⣕
⠀⠀⢀⠀⡀⠀⠀⣀⣴⣾⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⡗⢠⠘⡼⣽⣛⡞⠦⣧⢻⣽
⠀⢈⠀⡀⡀⢤⠞⡉⢭⣹⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣍⣣⢾⣵⣯⣷⣽⣦⣑⣯⢿
⠀⠂⣴⣾⡟⣧⠊⡔⢢⠛⣿⣿⣿⣿⣿⣿⣿⣿⣷⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⡟⠉⣯⢹⣽⢻⣿⣿⣿⣿⣿⣿⣿⣿
⣶⣟⠳⣏⡿⣎⠳⣈⡜⣺⣿⠿⢿⣝⡿⣫⢟⣽⣿⣿⠻⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠛⣿⠿⣟⢩⢾⣿⣿⣿⣿⣇⠾⣜⡧⣯⣟⣿⣿⣿⣿⣿⣿⣿⣿
⠋⢀⢱⣫⣟⢾⡹⢴⡸⣵⡏⣂⢾⡿⣽⣹⣟⣾⣿⡟⢠⡇⠀⣹⠂⠄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⣣⢟⡿⣾⣿⣿⣿⣿⢌⠫⢝⡻⣵⢻⡟⣿⢿⣿⢿⡿⣿⠿
⠀⢢⠞⣴⢯⢯⣝⣦⢳⡝⡶⣭⣿⣽⣳⣟⡾⣽⡟⢀⡟⠀⢀⡿⠀⠀⠀⠁⠠⠤⠀⠀⠀⠤⠐⠀⠀⠀⠀⠀⠀⠀⢸⡗⠈⠭⣿⣿⣿⣿⡿⢌⠣⡀⡐⢈⠃⠚⠦⣉⠂⠣⠜⡄⢋
⣜⣷⢻⡜⣯⣾⡞⣥⣓⢾⡽⢎⡷⢯⡷⣯⢟⣽⠃⣸⠁⠀⡼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⢹⣿⣿⣿⣿⢃⡮⡑⢰⢠⣂⡜⣦⡴⣱⣎⣴⣩⡜⣦
⣿⣯⢷⡻⣏⣷⣟⠶⣙⠮⡙⢪⠜⣯⢽⣯⣿⠃⠄⢃⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣾⣿⣿⣿⡇⠢⢡⡙⢦⡓⡼⣽⣾⣿⣿⣿⣿⣷⣿⣿
⣿⡹⢇⡳⡹⣞⠘⡈⢅⠢⢁⠂⡘⠤⣋⣶⣡⠴⠚⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⠰⡁⢆⠘⣡⠻⣽⣳⣿⣿⣿⣿⢿⣿⣿⣿
⢣⠝⡢⢍⠱⢈⣂⣌⡤⠦⠶⠶⠞⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⠛⠷⣭⣂⠌⢠⠓⡴⣻⣿⣿⣿⣿⣿⣿⣯⣿
⣇⢾⡱⠞⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⡇⠀⠀⠀⠉⠛⠳⠿⣶⣽⣿⣿⣿⣿⣿⣿⣿⣿
⠲⠶⠾⣶⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⢶⣶⣶⡷⠿⢿⣶⣦⠐⢲⣶⣶⡄⠀⢠⣾⣿⠗⠠⢶⣶⡶⠶⠴⢾⣷⣶⠶
⠀⠀⠀⣽⡇⠀⠀⠀⠀⢀⣤⣴⣶⣶⣄⡀⠀⠀⢀⣀⣘⣛⡃⠀⠀⠀⠀⢀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⣿⡟⠁⣀⡀⢻⡯⠀⠈⣷⢻⡆⠀⣸⠟⣿⠀⠀⠀⢽⡇⠀⠀⠀⣻⡇⠀
⠀⠀⠀⣿⡇⠀⠀⠀⠀⢸⣿⠁⠈⢙⣿⣷⠀⠀⠈⠛⠛⣿⣇⠀⠀⠀⠈⠻⣷⣶⡿⠟⣿⡇⠀⠀⠀⠀⣿⣧⣴⣿⣇⠀⠁⠀⠀⡇⠸⣿⠀⣿⠌⣿⠀⠀⠀⢿⡇⠀⠀⠀⣿⡇⠀
⠀⠀⠀⣿⡧⠀⠀⠀⠀⣠⣿⣶⣿⠿⣿⣿⠀⠀⠀⠀⠀⣿⡷⠀⠀⠀⠀⠀⣿⠋⠀⠀⣿⡇⠀⠀⠀⠀⣺⡏⠉⢿⠇⢀⡄⠀⠀⣿⠀⣿⣾⡟⠀⣿⠀⠀⠀⣾⡇⠀⠀⠀⣹⡇⠀
⠀⢀⡀⣿⣿⣄⣀⠀⠀⣿⣟⣁⣀⣠⣿⣯⣤⡀⠀⠀⠀⣿⣷⣀⠀⠀⠀⠘⣿⡀⠀⠀⣿⣷⡀⠀⠀⠀⣽⡆⠀⠀⠀⣼⡇⠀⠠⡟⠀⢸⣿⡇⠀⣿⠀⠀⠀⢿⣧⠀⠀⢠⣿⠃⠀
⠿⡿⠿⠿⠿⠿⠿⠗⠀⠙⠿⠿⠿⠟⠻⠿⠿⠁⠶⠾⠿⠿⣿⣿⢿⠆⠺⠿⠿⠿⠇⠿⠿⠿⠿⠂⠶⠶⠿⠿⠶⠿⠿⠿⠗⠠⠼⠿⠧⠜⠿⠳⠾⠿⠷⠀⠀⠈⠛⠷⠶⠿⠛⠀⠀
`;

interface CommandHistoryItem {
  id: number;
  type: 'command' | 'output' | 'neofetch' | 'welcome' | 'credits' | 'pong' | 'snake';
  content: string | JSX.Element;
  isAnimating?: boolean;
  neofetchData?: {
    logo: string;
    info: string;
  };
}

interface PongState {
  ballX: number;
  ballY: number;
  ballDirX: number; // -1 left, 1 right
  ballDirY: number; // -1 up, 1 down
  playerPaddleY: number;
  aiPaddleY: number;
  playerScore: number;
  aiScore: number;
}

const GAME_SIZE = 30; // tamaño cuadrado para ambos juegos

const PONG_WIDTH = GAME_SIZE;
const PONG_HEIGHT = GAME_SIZE;

const SNAKE_WIDTH = GAME_SIZE;
const SNAKE_HEIGHT = GAME_SIZE;

const INITIAL_SNAKE_LENGTH = 3;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeState {
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number };
  direction: Direction;
  score: number;
  gameOver: boolean;
}

export const AboutAlertView: React.FC<AboutAlertViewProps> = ({ item, onClose }) => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isAutoTyping, setIsAutoTyping] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [inPongMode, setInPongMode] = useState(false);
  const [pongState, setPongState] = useState<PongState | null>(null);
  const pongIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [inSnakeMode, setInSnakeMode] = useState(false);
  const [snakeState, setSnakeState] = useState<SnakeState | null>(null);
  const snakeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const nextId = useRef(1);
  
  // Track all timeouts for cleanup
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const isMountedRef = useRef(true);

  // Safe setTimeout wrapper that tracks and cleans up
  const safeTimeout = (callback: () => void, delay: number): NodeJS.Timeout => {
    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  };

  // Cleanup all intervals and timeouts on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all tracked timeouts
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current.clear();
      // Clear game intervals
      if (pongIntervalRef.current) {
        clearInterval(pongIntervalRef.current);
        pongIntervalRef.current = null;
      }
      if (snakeIntervalRef.current) {
        clearInterval(snakeIntervalRef.current);
        snakeIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    startInitialSequence();
    safeTimeout(() => setHasMounted(true), 20);
  }, []);

  // Captura global de teclas para Pong y Snake
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (inPongMode) {
        e.preventDefault();
        handlePongInput(e.key);
      } else if (inSnakeMode) {
        e.preventDefault();
        handleSnakeInput(e.key);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [inPongMode, pongState, inSnakeMode, snakeState]);

  // ----------- Pong -------------

  const renderPongScreen = (state: PongState): string => {
    const width = PONG_WIDTH;
    const height = PONG_HEIGHT;

    let screen = new Array(height).fill(null).map(() => new Array(width).fill(' '));

    // Bordes horizontal y vertical
    for (let x = 0; x < width; x++) {
      screen[0][x] = '-';
      screen[height - 1][x] = '-';
    }
    for (let y = 1; y < height - 1; y++) {
      screen[y][0] = '|';
      screen[y][width - 1] = '|';
    }
    // Línea punteada central
    for (let y = 1; y < height - 1; y += 2) {
      screen[y][Math.floor(width / 2)] = '|';
    }
    // Paletas (tamaño 3)
    for (let i = 0; i < 3; i++) {
      const py = state.playerPaddleY + i;
      if (py >= 1 && py < height - 1) screen[py][1] = '█';
      const ay = state.aiPaddleY + i;
      if (ay >= 1 && ay < height - 1) screen[ay][width - 2] = '█';
    }
    // Pelota
    if (
      state.ballY >= 1 &&
      state.ballY < height - 1 &&
      state.ballX >= 1 &&
      state.ballX < width - 1
    ) {
      screen[state.ballY][state.ballX] = '●';
    }
    // Marcador
    const scoreStr = `Jugador: ${state.playerScore}  Máxima: ${state.aiScore}`;
    const scoreStart = Math.floor((width - scoreStr.length) / 2);
    for (let i = 0; i < scoreStr.length; i++) {
      if (scoreStart + i < width) {
        screen[0][scoreStart + i] = scoreStr[i];
      }
    }
    return screen.map(row => row.join('')).join('\n');
  };

  const startPong = (commandId: number) => {
    setInPongMode(true);
    const initialState: PongState = {
      ballX: Math.floor(PONG_WIDTH / 2),
      ballY: Math.floor(PONG_HEIGHT / 2),
      ballDirX: Math.random() < 0.5 ? -1 : 1,
      ballDirY: Math.random() < 0.5 ? -1 : 1,
      playerPaddleY: Math.floor(PONG_HEIGHT / 2) - 1,
      aiPaddleY: Math.floor(PONG_HEIGHT / 2) - 1,
      playerScore: 0,
      aiScore: 0,
    };
    setPongState(initialState);
    setHistory(prev => [...prev, {
      id: commandId,
      type: 'pong',
      content: renderPongScreen(initialState)
    }]);

    pongIntervalRef.current = setInterval(() => {
      setPongState(prev => {
        if (!prev) return prev;
        let {
          ballX,
          ballY,
          ballDirX,
          ballDirY,
          playerPaddleY,
          aiPaddleY,
          playerScore,
          aiScore
        } = prev;

        // Mover pelota
        let newBallX = ballX + ballDirX;
        let newBallY = ballY + ballDirY;

        // Rebote arriba y abajo
        if (newBallY <= 1) {
          newBallY = 1;
          ballDirY = 1;
        }
        if (newBallY >= PONG_HEIGHT - 2) {
          newBallY = PONG_HEIGHT - 2;
          ballDirY = -1;
        }

        // Colisión con paletas
        if (newBallX === 2) { // Paleta jugador
          if (newBallY >= playerPaddleY && newBallY < playerPaddleY + 3) {
            ballDirX = 1;
          }
        }
        if (newBallX === PONG_WIDTH - 3) { // Paleta IA
          if (newBallY >= aiPaddleY && newBallY < aiPaddleY + 3) {
            ballDirX = -1;
          }
        }

        let newPlayerScore = playerScore;
        let newAiScore = aiScore;

        // Se sale la pelota
        let resetBall = false;
        if (newBallX <= 0) {
          newAiScore++;
          resetBall = true;
          ballDirX = 1;
        } else if (newBallX >= PONG_WIDTH - 1) {
          newPlayerScore++;
          resetBall = true;
          ballDirX = -1;
        }

        if (resetBall) {
          newBallX = Math.floor(PONG_WIDTH / 2);
          newBallY = Math.floor(PONG_HEIGHT / 2);
          ballDirY = Math.random() < 0.5 ? -1 : 1;
        } else {
          ballX = newBallX;
          ballY = newBallY;
        }

        // AI se mueve a veces (70% chance)
        let newAiPaddleY = aiPaddleY;
        if (Math.random() > 0.3) {
          if (ballX > PONG_WIDTH / 2) {
            if (ballY > aiPaddleY + 1) {
              newAiPaddleY = Math.min(PONG_HEIGHT - 4, aiPaddleY + 1);
            } else if (ballY < aiPaddleY + 1) {
              newAiPaddleY = Math.max(1, aiPaddleY - 1);
            }
          }
        }

        const updatedState: PongState = {
          ballX,
          ballY,
          ballDirX,
          ballDirY,
          playerPaddleY,
          aiPaddleY: newAiPaddleY,
          playerScore: newPlayerScore,
          aiScore: newAiScore,
        };

        setHistory(prevHistory => {
          const lastIndex = prevHistory.findIndex(h => h.type === 'pong');
          if (lastIndex === -1) return prevHistory;
          const newHistory = [...prevHistory];
          newHistory[lastIndex] = {
            ...newHistory[lastIndex],
            content: renderPongScreen(updatedState)
          };
          return newHistory;
        });

        return updatedState;
      });
    }, 150);
  };

  const handlePongInput = (key: string) => {
    if (!pongState) return;
    const paddleSpeed = 1;
    let newPlayerPaddleY = pongState.playerPaddleY;

    if (key === 'w' || key === 'W') {
      newPlayerPaddleY = Math.max(1, pongState.playerPaddleY - paddleSpeed);
    } else if (key === 's' || key === 'S') {
      newPlayerPaddleY = Math.min(PONG_HEIGHT - 4, pongState.playerPaddleY + paddleSpeed);
    } else if (key === 'q' || key === 'Q') {
      exitPong();
      return;
    }
    if (newPlayerPaddleY !== pongState.playerPaddleY) {
      setPongState({
        ...pongState,
        playerPaddleY: newPlayerPaddleY,
      });
    }
  };

  const exitPong = () => {
    setInPongMode(false);
    setPongState(null);
    if (pongIntervalRef.current) {
      clearInterval(pongIntervalRef.current);
      pongIntervalRef.current = null;
    }
    setHistory(prev => prev.filter(h => h.type !== 'pong'));
    const exitId = nextId.current++;
    setHistory(prev => [...prev, {
      id: exitId,
      type: 'output',
      content: <div>Has salido del juego Pong.</div>
    }]);
    if (inputRef.current) inputRef.current.focus();
  };

  // ----------- Snake -------------

  const generateFoodPosition = (snake: Array<{ x: number; y: number }>) => {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * (SNAKE_WIDTH - 2)) + 1,
        y: Math.floor(Math.random() * (SNAKE_HEIGHT - 2)) + 1,
      };
    } while (snake.some(seg => seg.x === position.x && seg.y === position.y));
    return position;
  };

  const renderSnakeScreen = (state: SnakeState): string => {
    const width = SNAKE_WIDTH;
    const height = SNAKE_HEIGHT;
    let screen = new Array(height).fill(null).map(() => new Array(width).fill(' '));

    // Bordes
    for (let x = 0; x < width; x++) {
      screen[0][x] = '-';
      screen[height - 1][x] = '-';
    }
    for (let y = 1; y < height - 1; y++) {
      screen[y][0] = '|';
      screen[y][width - 1] = '|';
    }

    // Comida
    screen[state.food.y][state.food.x] = '●';

    // Serpiente
    for (let i = 0; i < state.snake.length; i++) {
      const seg = state.snake[i];
      screen[seg.y][seg.x] = i === 0 ? '■' : '█'; // cabeza y cuerpo
    }

    // Puntaje centrado arriba
    const scoreStr = `SCORE: ${state.score}`;
    const scoreStart = Math.floor((width - scoreStr.length) / 2);
    for (let i = 0; i < scoreStr.length; i++) {
      if (scoreStart + i < width) {
        screen[0][scoreStart + i] = scoreStr[i];
      }
    }

    return screen.map(row => row.join('')).join('\n');
  };

  const getInitialSnakeState = (): SnakeState => {
    const initialSnake = [];
    const startX = Math.floor(SNAKE_WIDTH / 2);
    const startY = Math.floor(SNAKE_HEIGHT / 2);
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({ x: startX - i, y: startY });
    }
    return {
      snake: initialSnake,
      food: generateFoodPosition(initialSnake),
      direction: 'RIGHT',
      score: 0,
      gameOver: false,
    };
  };

  const startSnake = (commandId: number) => {
    setInSnakeMode(true);
    const initialState = getInitialSnakeState();
    setSnakeState(initialState);

    setHistory(prev => [...prev, {
      id: commandId,
      type: 'snake',
      content: renderSnakeScreen(initialState)
    }]);

    if (snakeIntervalRef.current) clearInterval(snakeIntervalRef.current);

    snakeIntervalRef.current = setInterval(() => {
      setSnakeState(prev => {
        if (!prev) return prev;
        const head = prev.snake[0];
        let newHead = { x: head.x, y: head.y };
        switch (prev.direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Colisiones
        if (
          newHead.x <= 0 || newHead.x >= SNAKE_WIDTH - 1 ||
          newHead.y <= 0 || newHead.y >= SNAKE_HEIGHT - 1 ||
          prev.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          const restartedState = getInitialSnakeState();
          setHistory(prevHistory => {
            const lastIndex = prevHistory.findIndex(h => h.type === 'snake');
            if (lastIndex === -1) return prevHistory;
            const newHistory = [...prevHistory];
            newHistory[lastIndex] = {
              ...newHistory[lastIndex],
              content: renderSnakeScreen(restartedState),
            };
            return newHistory;
          });
          return restartedState;
        }

        let newSnake = [newHead, ...prev.snake];
        let newFood = prev.food;
        let newScore = prev.score;

        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          newScore++;
          newFood = generateFoodPosition(newSnake);
        } else {
          newSnake.pop();
        }

        const newState = {
          snake: newSnake,
          food: newFood,
          direction: prev.direction,
          score: newScore,
          gameOver: false,
        };

        setHistory(prevHistory => {
          const lastIndex = prevHistory.findIndex(h => h.type === 'snake');
          if (lastIndex === -1) return prevHistory;
          const newHistory = [...prevHistory];
          newHistory[lastIndex] = {
            ...newHistory[lastIndex],
            content: renderSnakeScreen(newState),
          };
          return newHistory;
        });

        return newState;
      });
    }, 150);
  };

  const handleSnakeInput = (key: string) => {
    if (!snakeState || snakeState.gameOver) {
      if (key === 'q' || key === 'Q') {
        exitSnake();
      }
      return;
    }
    let newDirection = snakeState.direction;
    if ((key === 'w' || key === 'W') && snakeState.direction !== 'DOWN') {
      newDirection = 'UP';
    } else if ((key === 's' || key === 'S') && snakeState.direction !== 'UP') {
      newDirection = 'DOWN';
    } else if ((key === 'a' || key === 'A') && snakeState.direction !== 'RIGHT') {
      newDirection = 'LEFT';
    } else if ((key === 'd' || key === 'D') && snakeState.direction !== 'LEFT') {
      newDirection = 'RIGHT';
    } else if (key === 'q' || key === 'Q') {
      exitSnake();
      return;
    }
    if (newDirection !== snakeState.direction) {
      setSnakeState({ ...snakeState, direction: newDirection });
    }
  };

  const exitSnake = () => {
    setInSnakeMode(false);
    setSnakeState(null);
    if (snakeIntervalRef.current) {
      clearInterval(snakeIntervalRef.current);
      snakeIntervalRef.current = null;
    }
    setHistory(prev => prev.filter(h => h.type !== 'snake'));
    const exitId = nextId.current++;
    setHistory(prev => [...prev, {
      id: exitId,
      type: 'output',
      content: <div>Has salido del juego Snake.</div>
    }]);
    if (inputRef.current) inputRef.current.focus();
  };

  // ------------ Funciones originales -------------

  const showCredits = () => {
    const creditsId = nextId.current++;
    const creditsOutput = renderCredits();
    setHistory(prev => [...prev, {
      id: creditsId,
      type: 'credits',
      content: creditsOutput,
      isAnimating: true
    }]);
    safeTimeout(() => {
      setHistory(prev =>
        prev.map(item =>
          item.id === creditsId ? { ...item, isAnimating: false } : item
        )
      );
    }, 500);
  };

  const showWelcomeMessage = (callback: () => void) => {
    const welcomeId = nextId.current++;
    const welcomeMessage = (
      <div className="welcomeMessage" style={{ marginBottom: 10 }}>
        <div>Bienvenido a la terminal de Habbo.</div>
        <div>Escribe <span className="highlight">'help'</span> para ver los comandos disponibles.</div>
      </div>
    );
    setHistory(prev => [...prev, {
      id: welcomeId,
      type: 'welcome',
      content: welcomeMessage
    }]);
    safeTimeout(callback, 1500);
  };

  const startInitialSequence = () => {
    setIsAutoTyping(true);
    showWelcomeMessage(() => {
      executeCommand("neofetch", true, () => {
        safeTimeout(() => {
          showCredits();
          safeTimeout(() => {
            setIsReady(true);
            setIsAutoTyping(false);
            if (inputRef.current) inputRef.current.focus();
          }, 1000);
        }, 500);
      });
    });
  };

  const animateLogo = (id: number, onComplete: () => void) => {
    const targetAscii = hotelLogo;
    let currentAscii = targetAscii.split('').map(char => char === '\n' ? '\n' : ' ').join('');
    let completed = false;
    const animate = () => {
      if (completed) return;
      let newAscii = "";
      let isComplete = true;
      for (let i = 0; i < targetAscii.length; i++) {
        if (targetAscii[i] === '\n') {
          newAscii += '\n';
          continue;
        }
        if (currentAscii[i] === targetAscii[i]) {
          newAscii += currentAscii[i];
        } else {
          isComplete = false;
          if (Math.random() < 0.1) {
            newAscii += targetAscii[i];
          } else {
            newAscii += randomChars[Math.floor(Math.random() * randomChars.length)];
          }
        }
      }
      setHistory(prev =>
        prev.map(item => {
          if (item.id === id && item.neofetchData) {
            return {
              ...item,
              neofetchData: {
                ...item.neofetchData,
                logo: newAscii
              }
            };
          }
          return item;
        })
      );
      currentAscii = newAscii;
      if (isComplete) {
        completed = true;
        onComplete();
      } else {
        safeTimeout(animate, 30);
      }
    };
    animate();
  };

  const animateInfo = (id: number, onComplete: () => void) => {
    const infoLines = [
      `${item.username}@${item.hotelName}`,
      `OS: ${item.hotelName}`,
      `Version: ${item.version}`,
      `Online: ${item.onlineUsers} usuarios`,
      `Rooms: ${item.activeRooms} activas`,
      `Uptime: ${item.uptime}`,
      `RAM: ${item.ramUsage} MB usados`,
      `CPU: ${item.cpuCores} núcleos`,
      `Memory: ${item.totalMemory} MB totales`,
    ];
    const fullInfo = infoLines.join('\n');
    let currentInfo = "";
    let index = 0;
    let completed = false;
    const animate = () => {
      if (completed) return;
      if (index < fullInfo.length) {
        currentInfo += fullInfo.charAt(index);
        setHistory(prev =>
          prev.map(item => {
            if (item.id === id && item.neofetchData) {
              return {
                ...item,
                neofetchData: {
                  ...item.neofetchData,
                  info: currentInfo
                }
              };
            }
            return item;
          })
        );
        index++;
        safeTimeout(animate, 5);
      } else {
        completed = true;
        onComplete();
      }
    };
    animate();
  };

  const executeNeofetch = (id: number, onComplete: () => void) => {
    setHistory(prev => [...prev, {
      id: id,
      type: 'neofetch',
      content: '',
      isAnimating: true,
      neofetchData: {
        logo: "",
        info: ""
      }
    }]);
    animateLogo(id, () => {
      animateInfo(id, () => {
        setHistory(prev =>
          prev.map(item =>
            item.id === id ? { ...item, isAnimating: false } : item
          )
        );
        onComplete();
      });
    });
  };

  const renderServerInfo = (info: string) => (
    <div className="serverInfo">
      {info.split('\n').map((line, index) => {
        const parts = line.split(':');
        if (parts.length > 1) {
          return (
            <div key={index}>
              <span className="label">{parts[0]}:</span>
              <span>{parts.slice(1).join(':')}</span>
            </div>
          );
        }
        return <div key={index}>{line}</div>;
      })}
    </div>
  );

  const renderCredits = () => (
    <div className={`credits ${history.some(h => h.isAnimating) ? 'animating' : ''}`}>
      <div className="creditsTitle">
        CRÉDITOS
      </div>
      <div className="creditsContent">
        <div className="creditsText">
          <div className="thanks">
            Gracias a las siguientes personas que han contribuido o motivado el desarrollo de este proyecto:
          </div>
          <ul>
            <li><span className="creditName">meis y Loon</span> – Por su ayuda en general.</li>
            <li><span className="creditName">OldKing &amp; Invicta</span> – Por sus explicaciones relacionadas con wireds.</li>
            <li><span className="creditName">Kaory &amp; Kev</span> – Por la motivación y el esfuerzo que siempre aportan innovando en la comunidad; eso también nos motiva a seguir.</li>
            <li>La <span className="highlightCommunity">comunidad española de Habbo</span> al completo.</li>
          </ul>
          <div className="personalThanks">
            Y gracias a ti también, <span className="usernameHighlight">{item.username}</span>, por formar parte de esta comunidad <span className="heart">❤️</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ------------ Comandos --------------

  const executeCommand = (command: string, isAuto = false, onComplete?: () => void) => {
    const commandId = nextId.current++;
    if (!isAuto) {
      setHistory(prev => [...prev, {
        id: commandId,
        type: 'command',
        content: command
      }]);
    }
    let output: JSX.Element | null = null;
    switch (command.trim().toLowerCase()) {
      case 'neofetch':
        executeNeofetch(commandId, () => {
          if (onComplete) onComplete();
        });
        break;
      case 'help':
        output = (
          <div className="helpOutput" style={{ marginTop: 10 }}>
            <div>Comandos disponibles:</div>
            <ul>
              <li><span className="commandHighlight">neofetch</span> - Muestra información del servidor</li>
              <li><span className="commandHighlight">credits</span> - Muestra los créditos</li>
              <li><span className="commandHighlight">clear</span> - Limpia la terminal</li>
              <li><span className="commandHighlight">help</span> - Muestra esta ayuda</li>
              <li><span className="commandHighlight">exit</span> - Cierra la terminal</li>
              <li><span className="commandHighlight">pong</span> - Juega al Pong contra la máquina</li>
              <li><span className="commandHighlight">snake</span> - Juega al Snake</li>
            </ul>
          </div>
        );
        setHistory(prev => [...prev, {
          id: commandId,
          type: 'output',
          content: output
        }]);
        if (onComplete) onComplete();
        break;

      case 'clear':
        setHistory([]);
        if (onComplete) onComplete();
        break;

      case 'credits':
        output = renderCredits();
        setHistory(prev => [...prev, {
          id: commandId,
          type: 'output',
          content: output
        }]);
        if (onComplete) onComplete();
        break;

      case 'exit':
        handleClose();
        if (onComplete) onComplete();
        break;

      case 'pong':
        startPong(commandId);
        if (onComplete) onComplete();
        break;

      case 'snake':
        startSnake(commandId);
        if (onComplete) onComplete();
        break;

      case '':
        if (onComplete) onComplete();
        break;

      default:
        output = (
          <div className="notFound" style={{ marginTop: 10 }}>
            <div>Comando no encontrado: <span className="errorText">{command}</span></div>
            <div>Escribe <span className="commandHighlight">'help'</span> para ver los comandos disponibles</div>
          </div>
        );
        setHistory(prev => [...prev, {
          id: commandId,
          type: 'output',
          content: output
        }]);
        if (onComplete) onComplete();
    }
    if (!isAuto) {
      setCurrentInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inPongMode || inSnakeMode) {
      e.preventDefault();
      // En modo Pong o Snake el keydown global ya gestiona el juego
      return;
    }
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [history]);

  const handleClose = () => {
    setIsClosing(true);

    if (pongIntervalRef.current) {
      clearInterval(pongIntervalRef.current);
      pongIntervalRef.current = null;
    }
    if (snakeIntervalRef.current) {
      clearInterval(snakeIntervalRef.current);
      snakeIntervalRef.current = null;
    }

    safeTimeout(() => {
      onClose();
    }, 550);
  };

  // --------- RENDER -----------

  return (
    <div
      onClick={() => {
        if (!inPongMode && !inSnakeMode && inputRef.current) inputRef.current.focus();
      }}
      className={`aboutAlertOverlay ${hasMounted && !isClosing ? 'visible' : ''}`}
    >
      <NitroCardView
        theme="primary-slim"
        overflow="visible"
        className={`aboutAlertCard ${isClosing ? 'closing' : (hasMounted ? 'mounted' : '')}`}
      >
        <div className="terminalHeader">
          <div className="circle red" />
          <div className="circle yellow" />
          <div className="circle green" />
          <span className="terminalPrompt">{item.username}@{item.hotelName}:~$</span>
        </div>
        <div
          ref={preRef as any}
          className={`terminalOutput ${inPongMode || inSnakeMode ? 'noSelect preMode' : 'preWrap'}`}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes flicker {
                0% { opacity: 0.8; }
                50% { opacity: 0.9; }
                100% { opacity: 0.8; }
              }
            `}
          </style>
          {history.map((entry) => {
            if (entry.type === 'command') {
              return (
                <div key={entry.id} className="commandLine">
                  <span className="terminalPrompt">{item.username}@{item.hotelName}:~$</span> {entry.content}
                </div>
              );
            }
            if (entry.type === 'output' || entry.type === 'welcome' || entry.type === 'credits') {
              return (
                <div
                  key={entry.id}
                  className="outputLine"
                  style={{
                    animation: entry.isAnimating ? "fadeIn 0.5s forwards" : "none",
                    opacity: entry.isAnimating ? 0 : 1
                  }}
                >
                  {entry.content}
                </div>
              );
            }
            if (entry.type === 'neofetch' && entry.neofetchData) {
              return (
                <div
                  key={entry.id}
                  className="neofetchContainer"
                  style={{
                    opacity: entry.isAnimating ? 0.92 : 1,
                    animation: entry.isAnimating ? "flicker 0.1s infinite" : "none"
                  }}
                >
                  <div className="neofetchLogo">
                    {entry.neofetchData.logo}
                  </div>
                  <div className="neofetchInfo">
                    {renderServerInfo(entry.neofetchData.info)}
                  </div>
                </div>
              );
            }
            if (entry.type === 'pong' || entry.type === 'snake') {
              return (
                <pre
                  key={entry.id}
                  className="gameScreen"
                >
                  {entry.content}
                </pre>
              );
            }
            return null;
          })}
          {!inPongMode && !inSnakeMode && isReady && (
            <div className="inputLine">
              <span className="terminalPrompt">{item.username}@{item.hotelName}:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminalInput"
                autoFocus
                disabled={isAutoTyping}
              />
            </div>
          )}
          {(inPongMode) && (
            <div className="gameInstructions">
              Usa <b>W</b> y <b>S</b> para mover tu paleta, <b>Q</b> para salir del juego.
            </div>
          )}
          {(inSnakeMode) && (
            <div className="gameInstructions">
              Usa <b>W</b>, <b>A</b>, <b>S</b>, <b>D</b> para mover la serpiente, <b>Q</b> para salir del juego.
            </div>
          )}
        </div>
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          className="closeButton"
        >
          &times;
        </button>
      </NitroCardView>
    </div>
  );
};
