# 資産格差シミュレーション

p5.jsを用いた人間社会における資産格差の発生をシミュレートするプログラムです。

## 概要

### モデルの説明

このシミュレーションは、エージェントベースモデル（Agent-Based Model）を用いて、経済的な相互作用を通じて資産格差が自然発生するプロセスを可視化します。

**理論的背景:**
- 初期状態では全員がほぼ同じ資産を保有
- エージェント（人）は空間内を自由に移動
- 近距離にいる他のエージェントとランダムに経済取引を行う
- 各取引は確率的に勝敗が決まる（ゼロサムゲーム）
- 外部からの資産注入や再分配メカニズムは存在しない

**数学的モデル:**
このシミュレーションは「ヤード・ポーカーモデル」や「ボルツマン富分布モデル」として知られる統計物理学的アプローチに基づいています。ランダムな経済取引を繰り返すことで、資産分布は時間とともに指数分布やパレート分布に近づき、必然的に格差が拡大します。

**実世界への示唆:**
- 市場経済では、規制や再分配がない場合、自然に格差が拡大する
- 「機会の平等」があっても「結果の平等」は保証されない
- ジニ係数の上昇は構造的な問題である可能性を示唆

### シミュレーションのメカニズム

1. **初期状態**: すべての人が同程度の資産を持ってスタート
2. **ランダムな移動**: エージェントが空間内を自由に移動
3. **近接取引**: 一定範囲内にいる他のエージェントと取引機会が発生
4. **確率的な勝敗**: 各取引で50%の確率で資産が移動（勝者と敗者が決まる）
5. **格差の発生**: 時間経過とともに、確率的な偏りによって格差が拡大
6. **富の集中**: 一度富を得たエージェントはより大きな取引が可能になり、さらに富を増やしやすくなる

## インストール方法

### 必要な環境
- モダンなウェブブラウザ（Chrome, Firefox, Safari, Edgeなど）
- インターネット接続（p5.jsをCDNから読み込むため）

### インストール手順

**方法1: 直接実行（推奨）**

```bash
# リポジトリをクローン
git clone <repository-url>
cd kakusa-sim

# ブラウザでindex.htmlを開く
# Linuxの場合
firefox index.html
# または
google-chrome index.html

# macOSの場合
open index.html

# Windowsの場合
start index.html
```

**方法2: ローカルサーバーを使用**

セキュリティ制約がある環境では、ローカルサーバーを立てることを推奨します。

```bash
# Pythonを使用する場合
python -m http.server 8000
# ブラウザで http://localhost:8000 を開く

# Node.jsを使用する場合
npx http-server -p 8000
# ブラウザで http://localhost:8000 を開く
```

**方法3: CDNなしでオフライン実行**

オフラインで実行したい場合は、p5.jsをローカルにダウンロードします。

```bash
# p5.jsをダウンロード
mkdir lib
cd lib
wget https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js
cd ..

# index.htmlのscriptタグを以下に変更
# <script src="lib/p5.min.js"></script>
```

### 動作確認

ブラウザでindex.htmlを開くと、以下が表示されます：
- 800x600pxのキャンバスに多数の円（エージェント）
- 右上にリアルタイムヒストグラム
- 下部にコントロールパネルと統計情報

正常に動作している場合、円が動き回り、色やサイズが徐々に変化します。

## 機能

### ビジュアライゼーション
- **色による表現**:
  - 赤: 貧困層
  - 黄: 中間層
  - 青: 富裕層
- **サイズ**: 資産額に応じて円のサイズが変化
- **ヒストグラム**: 右上に資産分布をリアルタイム表示

### 統計指標
- **ジニ係数**: 格差の程度を0〜1で表示（1に近いほど格差が大きい）
- **上位10%の資産割合**: 富裕層への資産集中度
- **下位10%の資産割合**: 貧困層の資産保有状況
- **平均資産**: 全体の平均値
- **中央値**: 分布の中央値

### パラメータ調整
- **人口**: 50〜500人
- **初期資産**: 各人の開始資産
- **取引確率**: フレームごとの取引発生確率
- **取引額の最大比率**: 1回の取引で動く資産の割合

## 使い方

1. ブラウザで `index.html` を開く
2. パラメータを調整してシミュレーションの挙動を観察
3. 「リセット」ボタンで初期状態に戻す
4. 「一時停止/再開」で動作を制御

## 観察できる現象

- **時間経過による格差拡大**: 最初は均等でも、取引を繰り返すうちに格差が発生
- **富の集中**: 上位層に資産が集中していく様子
- **ジニ係数の上昇**: 格差が広がるとジニ係数が増加
- **二極化**: 富裕層と貧困層に分かれる傾向

## 技術仕様

- **フレームワーク**: p5.js 1.7.0
- **言語**: JavaScript (ES6)
- **ブラウザ**: モダンブラウザ対応

## ファイル構成

- `index.html`: メインHTMLファイル
- `sketch.js`: p5.jsシミュレーションロジック
- `README.md`: このファイル

## 参考文献

### 経済物理学・資産分布モデル

1. **Chakraborti, A., & Chakrabarti, B. K. (2000).** "Statistical mechanics of money: How saving propensities affect its distribution." *The European Physical Journal B*, 17(1), 167-170.
   - 貯蓄性向が資産分布に与える影響を統計力学的に分析

2. **Yakovenko, V. M., & Rosser Jr, J. B. (2009).** "Colloquium: Statistical mechanics of money, wealth, and income." *Reviews of Modern Physics*, 81(4), 1703-1725.
   - 資産・所得分布の統計力学的レビュー論文

3. **Dragulescu, A., & Yakovenko, V. M. (2000).** "Statistical mechanics of money." *The European Physical Journal B*, 17(4), 723-729.
   - 貨幣のボルツマン分布モデルの基礎理論

### エージェントベースモデル

4. **Epstein, J. M., & Axtell, R. (1996).** *Growing Artificial Societies: Social Science from the Bottom Up.* MIT Press.
   - エージェントベースモデリングの古典的著作

5. **Wilensky, U., & Rand, W. (2015).** *An Introduction to Agent-Based Modeling: Modeling Natural, Social, and Engineered Complex Systems with NetLogo.* MIT Press.
   - ABMの入門書、富の分配モデルを含む

### ジニ係数と所得格差

6. **Gini, C. (1912).** "Variabilità e mutabilità." *Reprinted in Memorie di metodologica statistica* (Ed. Pizetti E, Salvemini, T). Rome: Libreria Eredi Virgilio Veschi, 1955.
   - ジニ係数の原著論文

7. **Atkinson, A. B. (1970).** "On the measurement of inequality." *Journal of Economic Theory*, 2(3), 244-263.
   - 不平等の測定に関する経済学的考察

### 富の集中とパレート分布

8. **Pareto, V. (1896).** *Cours d'économie politique.* Lausanne: Rouge.
   - パレート分布の原典（80-20の法則）

9. **Piketty, T. (2014).** *Capital in the Twenty-First Century.* Harvard University Press.
   - 現代における資本収益率と格差拡大のメカニズム

### シミュレーション・可視化技術

10. **p5.js Documentation.** https://p5js.org/
    - 本シミュレーションで使用したJavaScriptライブラリ

11. **Shiffman, D. (2012).** *The Nature of Code: Simulating Natural Systems with Processing.* Self-published.
    - 自然現象やエージェントベースモデルのプログラミング入門書

### 関連するオンラインリソース

- **NetLogo Models Library - Wealth Distribution**
  https://ccl.northwestern.edu/netlogo/models/WealthDistribution
  - 類似の資産分配シミュレーションモデル

- **Complexity Explorables - "Congestion, Redistribution, and Inequality"**
  https://www.complexity-explorables.org/
  - インタラクティブな複雑系シミュレーション集

- **Santa Fe Institute - Economic Complexity**
  https://www.santafe.edu/
  - 経済物理学・複雑系経済学の研究機関

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。

## 貢献

バグ報告や機能追加の提案は、GitHubのIssueまたはPull Requestでお願いします。
