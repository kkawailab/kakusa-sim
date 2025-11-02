let people = [];
let isPaused = false;
let frameCounter = 0;

class Person {
    constructor(x, y, wealth) {
        this.x = x;
        this.y = y;
        this.wealth = wealth;
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.radius = 5;
    }

    update(width, height) {
        if (isPaused) return;

        // 移動
        this.x += this.vx;
        this.y += this.vy;

        // 壁での反射
        if (this.x < this.radius || this.x > width - this.radius) {
            this.vx *= -1;
            this.x = constrain(this.x, this.radius, width - this.radius);
        }
        if (this.y < this.radius || this.y > height - this.radius) {
            this.vy *= -1;
            this.y = constrain(this.y, this.radius, height - this.radius);
        }
    }

    display(maxWealth) {
        // 資産に応じて色を変更（赤＝貧困、緑＝中間、青＝富裕）
        let wealthRatio = this.wealth / maxWealth;
        let r, g, b;

        if (wealthRatio < 0.5) {
            // 貧困層: 赤から黄色
            r = 255;
            g = map(wealthRatio, 0, 0.5, 50, 255);
            b = 50;
        } else {
            // 富裕層: 黄色から青
            r = map(wealthRatio, 0.5, 1, 255, 50);
            g = map(wealthRatio, 0.5, 1, 255, 150);
            b = map(wealthRatio, 0.5, 1, 50, 255);
        }

        fill(r, g, b);
        noStroke();
        let size = map(this.wealth, 0, maxWealth, 3, 12);
        circle(this.x, this.y, size);
    }

    trade(other) {
        if (this.wealth <= 0 && other.wealth <= 0) return;

        let tradeAmountRatio = parseFloat(document.getElementById('tradeAmount').value) / 100;

        // 取引額は両者の資産の一定割合の平均
        let maxTrade = min(
            this.wealth * tradeAmountRatio,
            other.wealth * tradeAmountRatio
        );

        if (maxTrade <= 0) return;

        let amount = random(0, maxTrade);

        // ランダムに勝者を決定（50%の確率）
        if (random() < 0.5) {
            this.wealth += amount;
            other.wealth -= amount;
        } else {
            this.wealth -= amount;
            other.wealth += amount;
        }

        // 資産が負にならないようにする
        this.wealth = max(0, this.wealth);
        other.wealth = max(0, other.wealth);
    }
}

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    initializePeople();
}

function draw() {
    background(30);

    let maxWealth = getMaxWealth();

    // 人々を更新・表示
    for (let person of people) {
        person.update(width, height);
        person.display(maxWealth);
    }

    // 取引処理
    if (!isPaused && frameCounter % 2 === 0) {
        performTrades();
    }

    // 統計情報を更新（60フレームごと）
    if (frameCounter % 60 === 0) {
        updateStatistics();
    }

    frameCounter++;

    // ヒストグラムを描画
    drawHistogram();
}

function initializePeople() {
    people = [];
    let numPeople = parseInt(document.getElementById('population').value);
    let initialWealth = parseFloat(document.getElementById('initialWealth').value);

    for (let i = 0; i < numPeople; i++) {
        let x = random(20, width - 20);
        let y = random(20, height - 20);
        // 初期資産に少しランダム性を持たせる
        let wealth = initialWealth + random(-10, 10);
        people.push(new Person(x, y, wealth));
    }
}

function performTrades() {
    let tradeProbability = parseFloat(document.getElementById('tradeProbability').value) / 100;

    for (let i = 0; i < people.length; i++) {
        if (random() < tradeProbability) {
            // 近くの人と取引
            let closest = findClosestPerson(people[i], i);
            if (closest !== null) {
                people[i].trade(people[closest]);
            }
        }
    }
}

function findClosestPerson(person, index) {
    let minDist = Infinity;
    let closestIndex = null;
    let interactionRange = 100;

    for (let i = 0; i < people.length; i++) {
        if (i === index) continue;

        let d = dist(person.x, person.y, people[i].x, people[i].y);
        if (d < minDist && d < interactionRange) {
            minDist = d;
            closestIndex = i;
        }
    }

    return closestIndex;
}

function getMaxWealth() {
    let max = 0;
    for (let person of people) {
        if (person.wealth > max) {
            max = person.wealth;
        }
    }
    return max;
}

function drawHistogram() {
    let histWidth = 200;
    let histHeight = 150;
    let histX = width - histWidth - 10;
    let histY = 10;
    let numBins = 20;

    // 背景
    fill(0, 0, 0, 150);
    rect(histX, histY, histWidth, histHeight);

    // ヒストグラムデータを作成
    let bins = new Array(numBins).fill(0);
    let maxWealth = getMaxWealth();

    for (let person of people) {
        let binIndex = floor(map(person.wealth, 0, maxWealth, 0, numBins - 1));
        binIndex = constrain(binIndex, 0, numBins - 1);
        bins[binIndex]++;
    }

    let maxBin = max(bins);

    // ヒストグラムを描画
    let binWidth = histWidth / numBins;
    for (let i = 0; i < numBins; i++) {
        let barHeight = map(bins[i], 0, maxBin, 0, histHeight - 20);
        fill(100, 150, 255);
        rect(histX + i * binWidth, histY + histHeight - barHeight, binWidth - 1, barHeight);
    }

    // ラベル
    fill(255);
    textSize(12);
    textAlign(LEFT);
    text('資産分布', histX + 5, histY + 15);
}

function calculateGiniCoefficient() {
    if (people.length === 0) return 0;

    // 資産でソート
    let wealths = people.map(p => p.wealth).sort((a, b) => a - b);
    let n = wealths.length;
    let sumOfDifferences = 0;
    let sumOfWealth = 0;

    for (let i = 0; i < n; i++) {
        sumOfWealth += wealths[i];
        sumOfDifferences += (i + 1) * wealths[i];
    }

    if (sumOfWealth === 0) return 0;

    let gini = (2 * sumOfDifferences) / (n * sumOfWealth) - (n + 1) / n;
    return gini;
}

function updateStatistics() {
    // ジニ係数
    let gini = calculateGiniCoefficient();
    document.getElementById('gini').textContent = gini.toFixed(3);

    // 資産でソート
    let sortedWealth = people.map(p => p.wealth).sort((a, b) => b - a);
    let totalWealth = sortedWealth.reduce((sum, w) => sum + w, 0);

    // 上位10%の資産
    let top10Count = floor(people.length * 0.1);
    let top10Wealth = sortedWealth.slice(0, top10Count).reduce((sum, w) => sum + w, 0);
    let top10Percent = totalWealth > 0 ? (top10Wealth / totalWealth * 100) : 0;
    document.getElementById('top10').textContent = top10Percent.toFixed(1) + '%';

    // 下位10%の資産
    let bottom10Wealth = sortedWealth.slice(-top10Count).reduce((sum, w) => sum + w, 0);
    let bottom10Percent = totalWealth > 0 ? (bottom10Wealth / totalWealth * 100) : 0;
    document.getElementById('bottom10').textContent = bottom10Percent.toFixed(1) + '%';

    // 平均
    let avgWealth = totalWealth / people.length;
    document.getElementById('avgWealth').textContent = avgWealth.toFixed(1);

    // 中央値
    let medianWealth = sortedWealth[floor(sortedWealth.length / 2)];
    document.getElementById('medianWealth').textContent = medianWealth.toFixed(1);
}

function resetSimulation() {
    initializePeople();
    frameCounter = 0;
    isPaused = false;
    updateStatistics();
}

function togglePause() {
    isPaused = !isPaused;
}

function updateLabel(id) {
    let value = document.getElementById(id).value;
    let label = document.getElementById(id + '-label');

    switch(id) {
        case 'population':
        case 'initialWealth':
            label.textContent = value;
            break;
        case 'tradeProbability':
        case 'tradeAmount':
            label.textContent = value + '%';
            break;
    }
}
