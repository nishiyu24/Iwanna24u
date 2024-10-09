const under_ground = 800;
const blocksize = 32;
export var blocks = []; // グローバル変数としてexportする

// CSVファイルを読み込む関数getCSV()の定義
export function getCSV() {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRequestオブジェクトを生成
        req.open("get", "./data/blocks.csv", true); // アクセスするファイルを指定
        req.send(null); // HTTPリクエストの発行

        // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
        req.onload = function() {
            if (req.status === 200) {
                const mapTmp = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ

                // 行数と列数を確認
                const numRows = Math.min(mapTmp.length, 25); // 最大25行
                const numCols = Math.min(mapTmp[0] ? mapTmp[0].length : 0, 30); // 最大30列

                for (let i = 0; i < numRows; i++) {  // 横の範囲
                    for (let j = 0; j < numCols; j++) {  // 縦の範囲
                        const cell = mapTmp[numRows - 1 - i] && mapTmp[numRows - 1 - i][j] ? mapTmp[numRows - 1 - i][j].trim() : "";  // 上下反転のために行を逆に参照

                        if (cell === "G1") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 1, bclass: "Nground" });
                        } else if (cell === "G2") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 2, bclass: "Nground" });
                        } else if (cell === "G3") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 3, bclass: "Nground" });
                        } else if (cell === "G4") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 4, bclass: "Nground" });
                        } else if (cell === "G5") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 5, bclass: "Nground" });
                        } else if (cell === "N1") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 1, bclass: "needle" });
                        } else if (cell === "N2") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 2, bclass: "needle" });
                        } else if (cell === "N3") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 3, bclass: "needle" });
                        } else if (cell === "N4") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 4, bclass: "needle" });
                        } else if (cell === "W") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 0, bclass: "walkway" });
                        } else if (cell === "Sv") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 0, bclass: "save" });
                        } else if (cell === "St") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 0, bclass: "step" });
                        } else if (cell === "J") {
                            blocks.push({ x: blocksize * j, y: under_ground - blocksize * (i + 1), w: blocksize, h: blocksize, btype: 0, bclass: "jump" });
                        }
                    }
                }
                resolve(blocks); // 読み込み完了時にblocksを返す
            } else {
                reject(new Error(`Failed to load CSV: ${req.status}`)); // エラー処理
            }
        };

        req.onerror = function() {
            reject(new Error('Network error occurred')); // ネットワークエラーを処理
        };
    });
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される
    // 各行を改行で分割し、空の行をフィルタリング
    const rows = str.split('\n').filter(row => row.trim() !== '');
    // 行ごとにカンマで分割して2次元配列に変換
    const result = rows.map(row => row.split(','));
    return result;
}
