/* 業務自動化チェックシート（20問）— 回答はブラウザ内だけで集計し、送信しません。 */
(function () {
  'use strict';

  var FREQ = [{ l: 'よくある', s: 2 }, { l: 'ときどき', s: 1 }, { l: 'ほとんどない', s: 0 }];

  var SECTIONS = [
    { key: 'A', title: '会社のこと', lead: '結果をわかりやすくするための基本情報です（スコアには影響しません）。' },
    { key: 'B', title: '日々の業務の負担', lead: '手作業の多さから、自動化の余地を見ます。' },
    { key: 'C', title: 'デジタル化の土台', lead: '自動化を始めやすい状態かどうかを見ます。' },
    { key: 'D', title: 'AIの使い方と安全', lead: 'AIを業務に使うときに、危ないところがないかを見ます。' },
    { key: 'E', title: '優先したいこと', lead: '一番楽にしたい業務を教えてください。' }
  ];

  var QS = [
    { id: 'q1', sec: 'A', text: '業種を教えてください', opts: [{ l: '製造業' }, { l: '建設・不動産' }, { l: '卸売・小売' }, { l: '飲食・宿泊' }, { l: '医療・介護' }, { l: '士業・専門サービス' }, { l: 'IT・情報通信' }, { l: 'その他' }] },
    { id: 'q2', sec: 'A', text: '従業員数（パート含む）を教えてください', opts: [{ l: '1〜5名' }, { l: '6〜20名' }, { l: '21〜50名' }, { l: '51〜100名' }, { l: '101名以上' }] },
    { id: 'q3', sec: 'A', text: '回答者さまの立場を教えてください', opts: [{ l: '経営者' }, { l: '役員・管理職' }, { l: '事務・バックオフィス担当' }, { l: 'その他' }] },

    { id: 'q4', sec: 'B', text: '同じ内容を、複数のExcelやシステムに転記・二重入力している', opts: FREQ },
    { id: 'q5', sec: 'B', text: '見積書・請求書・発注書を、毎回手作業で作っている', opts: FREQ },
    { id: 'q6', sec: 'B', text: '勤怠・経費・売上の集計を、月末に手作業でまとめている', opts: FREQ },
    { id: 'q7', sec: 'B', text: '問い合わせやメールに、同じような返信を何度も書いている', opts: FREQ },
    { id: 'q8', sec: 'B', text: '必要な書類やデータを探すのに時間がかかる', opts: FREQ },
    { id: 'q9', sec: 'B', text: '会議の議事録や日報の作成・共有に手間がかかる', opts: FREQ },
    { id: 'q10', sec: 'B', text: '特定の人しか手順を知らない業務がある', opts: FREQ },

    { id: 'q11', sec: 'C', text: '業務のデータは主にどこにありますか', opts: [{ l: 'クラウド（Googleドライブ等）', s: 2 }, { l: '社内PC・サーバーのExcel', s: 1 }, { l: '紙が中心', s: 0 }] },
    { id: 'q12', sec: 'C', text: '業務の手順は書き出されていますか', opts: [{ l: 'ほとんど書き出している', s: 2 }, { l: '一部だけ', s: 1 }, { l: 'ほとんどない', s: 0 }] },
    { id: 'q13', sec: 'C', text: '社内に、ITやツールの相談役になれる人はいますか', opts: [{ l: 'いる', s: 2 }, { l: '兼任で少し', s: 1 }, { l: 'いない', s: 0 }] },
    { id: 'q14', sec: 'C', text: '会計・勤怠・販売管理などのクラウドサービスを使っていますか', opts: [{ l: '複数使っている', s: 2 }, { l: '1つ使っている', s: 1 }, { l: '使っていない', s: 0 }] },

    { id: 'q15', sec: 'D', text: '社員は、ChatGPTなどの生成AIを業務で使っていますか', opts: [{ l: '会社で把握し、使うツールを決めている', s: 2 }, { l: '個人の判断で使っているようだ', s: 0, f: 'shadow' }, { l: '使っていない', s: 1 }, { l: 'わからない', s: 0, f: 'shadow' }] },
    { id: 'q16', sec: 'D', text: 'AIに入力してよい情報など、利用ルールはありますか', opts: [{ l: '文書で決めて周知している', s: 2 }, { l: '口頭で伝えている程度', s: 1, f: 'rule' }, { l: '決めていない', s: 0, f: 'rule' }] },
    { id: 'q17', sec: 'D', text: '顧客情報や個人情報をAIに入力しないよう、管理できていますか', opts: [{ l: 'できている', s: 2 }, { l: '気をつけているが確認はしていない', s: 1, f: 'pii' }, { l: '特に管理していない', s: 0, f: 'pii' }] },
    { id: 'q18', sec: 'D', text: '業務ツールのアカウントや権限はどう管理していますか', opts: [{ l: '一人ずつ、必要な権限だけ', s: 2 }, { l: '一部で共有アカウントがある', s: 1, f: 'account' }, { l: '共有が多い・把握していない', s: 0, f: 'account' }] },
    { id: 'q19', sec: 'D', text: 'AIが作った文章や数字を、社外に出す前に人が確認していますか', opts: [{ l: '必ず確認している', s: 2 }, { l: '人によってまちまち', s: 1, f: 'review' }, { l: '確認していない・わからない', s: 0, f: 'review' }] },

    { id: 'q20', sec: 'E', text: 'いちばん楽にしたい業務はどれですか', opts: [{ l: '見積・請求などの書類作成', t: 'q5' }, { l: '集計・レポート', t: 'q6' }, { l: '問い合わせ・メール対応', t: 'q7' }, { l: 'データ入力・転記', t: 'q4' }, { l: '社内の情報共有', t: 'q8' }, { l: 'まだ決まっていない' }] }
  ];

  var CANDS = {
    q4: { title: 'データ転記・二重入力の自動連携', desc: 'システムやExcel間の転記を自動でつなぎ、入力の手間とミスを減らします。' },
    q5: { title: '見積書・請求書の自動作成', desc: '元データから書類を自動で作り、人は確認と送付だけにします。' },
    q6: { title: '月次集計・レポートの自動化', desc: '勤怠・経費・売上の集計を自動化し、月末の締め作業を短くします。' },
    q7: { title: '問い合わせ返信の下書き（AI）', desc: 'よくある問い合わせへの返信をAIが下書きし、人が確認して送ります。' },
    q8: { title: '社内文書の整理と検索（AI）', desc: '散らばった書類を整理し、AIで必要な情報を探せる状態にします。' },
    q9: { title: '議事録・日報の要約（AI）', desc: '録音やメモから、議事録や日報の下書きをAIが作ります。' },
    q10: { title: '業務手順の見える化', desc: '自動化の前に、特定の人に頼っている手順を書き出して引き継げる形にします。' }
  };

  var RISKS = {
    shadow: { title: 'AIの利用を会社として把握できていない', desc: '個人の判断でAIを使うと、どの情報が外部に渡ったか追えません。まず使うツールと用途を決めましょう。' },
    rule: { title: 'AIの利用ルールが文書になっていない', desc: '入力してよい情報・いけない情報を一枚にまとめて周知するだけでも、事故の多くは防げます。' },
    pii: { title: '顧客情報・個人情報の扱いが確認できていない', desc: '個人情報をAIに入力する前に、契約上・法令上の扱いと、使うサービスの設定を確認する必要があります。' },
    account: { title: '共有アカウント・権限の整理が必要', desc: 'AIや自動化ツールに業務を任せると、誰の権限で何が動いたかが重要になります。共有アカウントは先に整理しましょう。' },
    review: { title: 'AIの出力を人が確認する手順がない', desc: 'AIは誤った内容をもっともらしく出すことがあります。社外に出す前の確認者を決めましょう。' }
  };

  var answers = {};
  var resultShown = false;

  function pct(sum, max) { return Math.round(sum / max * 100); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- チェックシートの描画 ---------- */
  function renderChecklist(root) {
    var no = 0;
    SECTIONS.forEach(function (sec) {
      var wrap = el('div', 'q-section');
      var head = el('div', 'q-section-head');
      head.appendChild(el('span', 'q-section-key', sec.key));
      head.appendChild(el('h3', 'q-section-title', sec.title));
      wrap.appendChild(head);
      wrap.appendChild(el('p', 'q-section-lead', sec.lead));

      QS.filter(function (q) { return q.sec === sec.key; }).forEach(function (q) {
        no += 1;
        var fs = el('fieldset', 'question');
        var legend = el('legend', 'question-legend');
        legend.appendChild(el('span', 'question-no', 'Q' + no));
        legend.appendChild(el('span', 'question-text', q.text));
        fs.appendChild(legend);

        var opts = el('div', 'options');
        q.opts.forEach(function (o, i) {
          var b = el('button', 'option', o.l);
          b.type = 'button';
          b.setAttribute('aria-pressed', 'false');
          b.dataset.qid = q.id;
          b.dataset.idx = String(i);
          opts.appendChild(b);
        });
        fs.appendChild(opts);
        wrap.appendChild(fs);
      });
      root.appendChild(wrap);
    });

    root.addEventListener('click', function (e) {
      var b = e.target.closest('.option');
      if (!b) return;
      var qid = b.dataset.qid;
      answers[qid] = Number(b.dataset.idx);
      b.parentNode.querySelectorAll('.option').forEach(function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      update();
    });
  }

  /* ---------- 進捗と結果 ---------- */
  function sumSec(key) {
    var s = 0, max = 0;
    QS.forEach(function (q) {
      if (q.sec !== key) return;
      max += 2;
      if (answers[q.id] !== undefined) s += q.opts[answers[q.id]].s || 0;
    });
    return pct(s, max);
  }

  function computeResult() {
    var auto = sumSec('B'), ready = sumSec('C'), safe = sumSec('D');

    var scores = [
      { label: '自動化の余地', v: auto, desc: '高いほど、自動化で浮かせられる時間が大きい状態です。', warnLow: false },
      { label: '導入の準備度', v: ready, desc: '高いほど、データや手順が整っていて始めやすい状態です。', warnLow: false },
      { label: 'AIの安全度', v: safe, desc: '低いほど、AIを使う前に整えたいことが多い状態です。', warnLow: true }
    ];

    var boost = null;
    if (answers.q20 !== undefined) boost = QS[QS.length - 1].opts[answers.q20].t || null;
    var cands = QS.filter(function (q) { return q.sec === 'B'; }).map(function (q, idx) {
      var v = answers[q.id] !== undefined ? (q.opts[answers[q.id]].s || 0) : 0;
      if (boost === q.id) v += 1.5;
      return { id: q.id, v: v, idx: idx };
    }).filter(function (c) { return c.v > 0; })
      .sort(function (x, y) { return (y.v - x.v) || (x.idx - y.idx); })
      .slice(0, 3)
      .map(function (c) { return CANDS[c.id]; });

    var seen = {}, risks = [];
    QS.forEach(function (q) {
      if (q.sec !== 'D' || answers[q.id] === undefined) return;
      var f = q.opts[answers[q.id]].f;
      if (f && !seen[f]) { seen[f] = true; risks.push(RISKS[f]); }
    });

    var summary;
    if (auto >= 50 && safe < 50) summary = '自動化で浮かせられる時間は大きい一方、AIの使い方に先に整えたい点があります。ルールを決めてから着手すると、安全に効果を出せます。';
    else if (auto >= 50 && ready < 40) summary = '自動化の余地は大きいですが、データや手順の整理から始めるのが近道です。';
    else if (auto >= 50) summary = '自動化の余地が大きく、土台も整っています。効果の大きい業務から小さく始められる状態です。';
    else if (safe < 50) summary = '手作業の負担は比較的少ない一方、AIの使い方に整えたい点があります。事故が起きる前の備えをおすすめします。';
    else summary = '今のところ大きな手作業の負担は少ない状態です。面談では、見落としがちな手作業や今後の備えを一緒に確認します。';

    return { scores: scores, cands: cands, risks: risks, summary: summary };
  }

  function levelOf(v, warnLow) {
    if (v >= 67) return { t: '高', cls: 'is-high' };
    if (v >= 34) return { t: '中', cls: '' };
    return warnLow ? { t: '要確認', cls: 'is-warn' } : { t: '低', cls: '' };
  }

  function renderResult() {
    var r = computeResult();
    document.getElementById('summary').textContent = r.summary;

    var scoresEl = document.getElementById('scores');
    scoresEl.replaceChildren();
    r.scores.forEach(function (s) {
      var lv = levelOf(s.v, s.warnLow);
      var row = el('div');
      var head = el('div', 'score-head');
      head.appendChild(el('span', 'score-label', s.label));
      head.appendChild(el('span', 'score-level ' + lv.cls, lv.t + '（' + s.v + '点）'));
      row.appendChild(head);
      var meter = el('div', 'meter meter-lg');
      var fill = el('div', 'meter-fill' + (s.warnLow && s.v < 34 ? ' is-warn' : ''));
      fill.style.width = Math.max(s.v, 3) + '%';
      meter.appendChild(fill);
      row.appendChild(meter);
      row.appendChild(el('div', 'score-desc', s.desc));
      scoresEl.appendChild(row);
    });

    var candEl = document.getElementById('candidates');
    candEl.replaceChildren();
    if (r.cands.length) {
      r.cands.forEach(function (c, i) {
        var row = el('div', 'cand');
        row.appendChild(el('span', 'cand-rank', String(i + 1)));
        var body = el('div');
        body.appendChild(el('div', 'cand-title', c.title));
        body.appendChild(el('div', 'card-body', c.desc));
        row.appendChild(body);
        candEl.appendChild(row);
      });
    } else {
      candEl.appendChild(el('div', 'card-body', '大きな手作業の負担は見当たりませんでした。面談では、見落としがちな手作業を一緒に洗い出します。'));
    }

    var riskEl = document.getElementById('risks');
    riskEl.replaceChildren();
    if (r.risks.length) {
      r.risks.forEach(function (k) {
        var row = el('div', 'risk');
        row.appendChild(el('div', 'risk-title', k.title));
        row.appendChild(el('div', 'card-body', k.desc));
        riskEl.appendChild(row);
      });
    } else {
      riskEl.appendChild(el('div', 'card-body', 'AIの使い方の基本は押さえられています。自動化を進める際も、この管理を続けることが大切です。'));
    }
  }

  function update() {
    var answered = Object.keys(answers).length;
    var total = QS.length;
    var complete = answered >= total;
    var p = pct(answered, total);

    document.getElementById('answered').textContent = answered;
    document.getElementById('remaining').textContent = total - answered;
    document.getElementById('progress-fill').style.width = p + '%';
    document.getElementById('progress').setAttribute('aria-valuenow', String(p));
    document.getElementById('show-result').hidden = !complete;
    document.getElementById('remaining-msg').hidden = complete;

    // 結果表示後に回答を変えた場合は、その場で結果を更新
    if (resultShown && complete) renderResult();
  }

  function showResult() {
    resultShown = true;
    renderResult();
    var section = document.getElementById('result');
    section.hidden = false;
    setTimeout(function () {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('total').textContent = QS.length;
    renderChecklist(document.getElementById('checklist'));
    document.getElementById('show-result').addEventListener('click', showResult);
    update();
  });
})();
