<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لعبة XO + شات محلي فوري</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; }
        body { 
            background: linear-gradient(135deg, #0f172a, #1e1b4b); 
            color: #fff; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center;
            min-height: 100vh; 
            padding: 20px; 
        }
        
        #secret-btn {
            position: fixed;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            width: 40px; 
            height: 40px;
            cursor: pointer;
            z-index: 1000;
        }

        h1 { margin-bottom: 20px; font-size: 28px; font-weight: 800; background: linear-gradient(90deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .game-container {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            text-align: center;
            max-width: 360px;
            width: 100%;
        }

        .status { font-size: 16px; margin-bottom: 15px; color: #cbd5e1; font-weight: 600; }

        .board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            background: rgba(15, 23, 42, 0.6);
            padding: 12px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        .cell {
            background: rgba(255, 255, 255, 0.05);
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 32px;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.2s;
            color: #fff;
        }
        .cell:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.03); }
        .cell.x { color: #38bdf8; }
        .cell.o { color: #f43f5e; }

        .controls button {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            transition: 0.3s;
            width: 100%;
        }
        .controls button:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.6); }

        #chat-modal {
            display: none;
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #1e293b;
            border: 1px solid rgba(56, 189, 248, 0.3);
            width: 90%; max-width: 360px;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            z-index: 2000;
            overflow: hidden;
        }

        .chat-header {
            background: linear-gradient(135deg, #0284c7, #0369a1);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }
        .chat-header button { background: none; border: none; color: white; font-size: 16px; cursor: pointer; }
        
        .chat-messages {
            height: 220px;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 14px;
            background: #0f172a;
        }
        .chat-messages div {
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 85%;
            word-break: break-word;
        }
        .chat-messages div b { color: #38bdf8; display: block; margin-bottom: 2px; }

        .chat-input-area {
            display: flex;
            padding: 12px;
            background: #1e293b;
            gap: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .chat-input-area input {
            flex: 1;
            padding: 10px 14px;
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            border-radius: 8px;
            outline: none;
        }
        .chat-input-area button {
            background: #22c55e;
            color: white;
            border: none;
            padding: 0 16px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
        }

        .heart {
            position: fixed;
            color: #ef4444;
            font-size: 26px;
            animation: floatUp 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            z-index: 3000;
        }
        @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 1; }
            100% { transform: translateY(-450px) scale(1.4); opacity: 0; }
        }
    </style>
</head>
<body>

    <button id="secret-btn" onclick="openSecret()"></button>

    <h1>لعبة XO (إكس أو)</h1>

    <div class="game-container">
        <div class="status" id="status">دور اللاعب: X</div>
        <div class="board" id="board">
            <div class="cell" onclick="makeMove(0)"></div>
            <div class="cell" onclick="makeMove(1)"></div>
            <div class="cell" onclick="makeMove(2)"></div>
            <div class="cell" onclick="makeMove(3)"></div>
            <div class="cell" onclick="makeMove(4)"></div>
            <div class="cell" onclick="makeMove(5)"></div>
            <div class="cell" onclick="makeMove(6)"></div>
            <div class="cell" onclick="makeMove(7)"></div>
            <div class="cell" onclick="makeMove(8)"></div>
        </div>
        <div class="controls">
            <button onclick="resetGame()">إعادة اللعب 🔄</button>
        </div>
    </div>

    <!-- نافذة الدردشة -->
    <div id="chat-modal">
        <div class="chat-header">
            <span>الدردشة الجماعية السرية 💬</span>
            <button onclick="closeChat()">✕</button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div><b>النظام:</b> تم تفعيل الشات الفوري بنجاح!</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="msg-input" placeholder="اكتب رسالتك..." onkeypress="handleKey(event)">
            <button onclick="sendMessage()">إرسال</button>
        </div>
    </div>

    <script>
        // استخدام BroadcastChannel عشان الرسائل تنتقل فوري بين أي صفحات مفتوحة لنفس اللعبة على جهازك
        const chatChannel = new BroadcastChannel('secret_game_chat_channel');
        let myName = "لاعب_" + Math.floor(Math.random() * 900 + 100);

        // استقبال الرسائل فوراً من أي متصفح أو تبويب تاني مفتوح
        chatChannel.onmessage = (event) => {
            let data = event.data;
            let chatBox = document.getElementById('chat-messages');
            chatBox.innerHTML += `<div><b>${data.name}:</b> ${data.text}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        function sendMessage() {
            let input = document.getElementById('msg-input');
            let text = input.value.trim();
            if(!text) return;

            // عرض رسالتك عندك
            let chatBox = document.getElementById('chat-messages');
            chatBox.innerHTML += `<div><b>أنت:</b> ${text}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;

            // إرسال الرسالة لباقي التبويبات المفتوحة
            chatChannel.postMessage({ name: myName, text: text });

            input.value = '';
        }

        // --- منطق لعبة XO ---
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let isGameActive = true;

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        function makeMove(index) {
            if (board[index] !== '' || !isGameActive) return;
            board[index] = currentPlayer;
            let cell = document.getElementsByClassName('cell')[index];
            cell.innerText = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());
            checkResult();
        }

        function checkResult() {
            let roundWon = false;
            for (let i = 0; i < winningConditions.length; i++) {
                let [a, b, c] = winningConditions[i];
                if (board[a] === '' || board[b] === '' || board[c] === '') continue;
                if (board[a] === board[b] && board[b] === board[c]) {
                    roundWon = true;
                    break;
                }
            }
            if (roundWon) {
                document.getElementById('status').innerText = `اللاعب ${currentPlayer} فاز! 🎉`;
                isGameActive = false;
                return;
            }
            if (!board.includes('')) {
                document.getElementById('status').innerText = `تعادل! 🤝`;
                isGameActive = false;
                return;
            }
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status').innerText = `دور اللاعب: ${currentPlayer}`;
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            isGameActive = true;
            document.getElementById('status').innerText = `دور اللاعب: X`;
            let cells = document.getElementsByClassName('cell');
            for (let i = 0; i < cells.length; i++) {
                cells[i].innerText = '';
                cells[i].className = 'cell';
            }
        }

        // --- الزرار السري (أعلى اليمين مخفي تماماً) ---
        function openSecret() {
            let pass = prompt("أدخل كلمة المرور السرية:");
            if (pass === "1234") {
                for (let i = 0; i < 35; i++) createHeart();
            } else if (pass === "777") {
                document.getElementById('chat-modal').style.display = 'block';
            } else if (pass !== null) {
                alert("الباسورد غلط يا صاحبي!");
            }
        }

        function createHeart() {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = 'ندي❤️';
            heart.style.left = Math.random() * (window.innerWidth - 50) + 'px';
            heart.style.top = (window.innerHeight - 60) + 'px';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }

        function closeChat() {
            document.getElementById('chat-modal').style.display = 'none';
        }

        function handleKey(e) {
            if (e.key === 'Enter') sendMessage();
        }
    </script>
</body>
</html>
