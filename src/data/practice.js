'use strict';

/* =========================================================
   PRACTICE DATA
   BUGS     — find the line with the bug
   PUZZLES  — put the steps in order; the result runs live
   OUTPUTS  — predict what the code prints
   ========================================================= */

/**
 * bug:  index of the line that causes the problem
 * fix:  the corrected version of that line
 */
const BUGS = [
    {
        topic: 'variables',
        goal: 'ფასების ჯამი უნდა დაითვალოს: 15',
        lines: [
            'const prices = [5, 4, 6];',
            'const total = 0;',
            'for (const p of prices) {',
            '  total += p;',
            '}',
            'console.log(total); // 15',
        ],
        bug: 1,
        fix: 'let total = 0;',
        hint: 'რომელი ცვლადი იცვლება ციკლში? შეუძლია კი მას შეცვლა?',
        explain: 'total ციკლში იცვლება (total += p), მაგრამ const-ით არის შექმნილი. const-ს ხელახლა ვერ მიანიჭებ, ამიტომ TypeError ამოვარდება. let უნდა იყოს.',
    },
    {
        topic: 'conditions',
        goal: 'მხოლოდ სრულწლოვანმა უნდა ნახოს „შესვლა ნებადართულია“',
        lines: [
            'const age = 15;',
            'if (age = 18) {',
            "  console.log('შესვლა ნებადართულია');",
            '} else {',
            "  console.log('ჯერ ადრეა');",
            '}',
        ],
        bug: 1,
        fix: 'if (age >= 18) {',
        hint: 'დააკვირდი ნიშანს პირობაში: ადარებს თუ ანიჭებს?',
        explain: '= ანიჭებს მნიშვნელობას: age ხდება 18, ეს კი truthy-ა, ამიტომ პირობა ყოველთვის სრულდება. შედარებისთვის >= ან === გვჭირდება.',
    },
    {
        topic: 'loops',
        goal: 'ყველა სახელი უნდა დაიბეჭდოს, ბოლოს undefined-ის გარეშე',
        lines: [
            "const names = ['ანა', 'გიო', 'ლუკა'];",
            'for (let i = 0; i <= names.length; i++) {',
            '  console.log(names[i]);',
            '}',
        ],
        bug: 1,
        fix: 'for (let i = 0; i < names.length; i++) {',
        hint: 'რამდენი ელემენტია მასივში და რომელია ბოლო ინდექსი?',
        explain: 'მასივში 3 ელემენტია, ინდექსები კი 0, 1, 2. <= names.length ნიშნავს, რომ i 3-საც მიაღწევს, names[3] კი undefined-ია. < უნდა იყოს.',
    },
    {
        topic: 'functions',
        goal: 'double(4) უნდა დააბრუნოს 8',
        lines: [
            'function double(n) {',
            '  n * 2;',
            '}',
            'const result = double(4);',
            'console.log(result); // 8',
        ],
        bug: 1,
        fix: '  return n * 2;',
        hint: 'ფუნქცია ითვლის, მაგრამ შედეგს გარეთ აბრუნებს?',
        explain: 'ფუნქცია n * 2-ს ითვლის, მაგრამ return არ აქვს. ასეთი ფუნქცია void-ია და undefined-ს აბრუნებს. return n * 2 უნდა იყოს.',
    },
    {
        topic: 'classes',
        goal: "leaf.color უნდა იყოს 'green'",
        lines: [
            'class Leaf {',
            '  constructor(color) {',
            '    color = color;',
            '  }',
            '}',
            "const leaf = new Leaf('green');",
            'console.log(leaf.color); // green',
        ],
        bug: 2,
        fix: '    this.color = color;',
        hint: 'სად ინახება მნიშვნელობა: ობიექტში თუ მხოლოდ პარამეტრში?',
        explain: 'color = color პარამეტრს თავისსავე მნიშვნელობას ანიჭებს და ობიექტში არაფერი ინახება. ობიექტის თვისებისთვის this.color გვჭირდება.',
    },
    {
        topic: 'conditions',
        goal: "season = 'autumn' → ფერი უნდა იყოს 'yellow'",
        lines: [
            'let color;',
            'switch (season) {',
            "  case 'autumn':",
            "    color = 'yellow';",
            "  case 'winter':",
            "    color = 'white';",
            '    break;',
            '}',
        ],
        bug: 3,
        fix: "    color = 'yellow'; break;",
        hint: 'რა ხდება case-ის ბოლოს, თუ მას არაფერი აჩერებს?',
        explain: "break-ის გარეშე კოდი შემდეგ case-შიც „ჩაცვივდება“ (fall-through): color ჯერ 'yellow' ხდება, მერე კი 'white'. 'autumn'-ის ბოლოს break უნდა დაემატოს.",
    },
    {
        topic: 'dom',
        goal: 'ღილაკზე დაჭერისას ტექსტი უნდა შეიცვალოს',
        lines: [
            '// HTML: <button class="save">შენახვა</button>',
            "const btn = document.querySelector('save');",
            "btn.addEventListener('click', () => {",
            "  btn.textContent = 'შენახულია';",
            '});',
        ],
        bug: 1,
        fix: "const btn = document.querySelector('.save');",
        hint: 'querySelector CSS სელექტორს იღებს. როგორ იწერება კლასი CSS-ში?',
        explain: "'save' ეძებს <save> თეგს, რომელიც არ არსებობს, ამიტომ btn არის null და addEventListener შეცდომას ისვრის. კლასისთვის წერტილი გვჭირდება: '.save'.",
    },
    {
        topic: 'dom',
        goal: 'შეყვანილ რიცხვს 10 უნდა დაემატოს: 5 → 15',
        lines: [
            "const input = document.querySelector('#num');",
            'const total = input.value + 10;',
            'result.textContent = total; // 15',
        ],
        bug: 1,
        fix: 'const total = Number(input.value) + 10;',
        hint: 'რა ტიპისაა input.value? რა ხდება, როცა ტექსტს რიცხვს უმატებ?',
        explain: "input.value ყოველთვის სტრიქონია. '5' + 10 ტექსტად გაერთიანდება და მიიღებ '510'-ს. ჯერ Number()-ით უნდა გადააქციო რიცხვად.",
    },
    {
        topic: 'bom',
        goal: 'მომხმარებელი უნდა შეინახოს და მერე წაიკითხოს',
        lines: [
            "const user = { name: 'ნინო' };",
            "localStorage.setItem('user', user);",
            "const saved = JSON.parse(localStorage.getItem('user'));",
            'console.log(saved.name); // ნინო',
        ],
        bug: 1,
        fix: "localStorage.setItem('user', JSON.stringify(user));",
        hint: 'რას ინახავს localStorage: ობიექტს თუ მხოლოდ ტექსტს?',
        explain: "localStorage მხოლოდ სტრიქონს ინახავს. ობიექტი გადაიქცევა '[object Object]'-ად და JSON.parse შეცდომას ისვრის. ჯერ JSON.stringify(user) უნდა გააკეთო.",
    },
    {
        topic: 'api',
        goal: 'სერვერიდან მოსული პოსტის სათაური უნდა გამოჩნდეს',
        lines: [
            'async function loadPost() {',
            "  const res = await fetch('/api/posts/1');",
            '  const post = res.json();',
            '  title.textContent = post.title;',
            '}',
        ],
        bug: 2,
        fix: '  const post = await res.json();',
        hint: 'res.json() მყისიერად აბრუნებს მონაცემს თუ Promise-ს?',
        explain: 'res.json() Promise-ს აბრუნებს. await-ის გარეშე post არის Promise და post.title იქნება undefined. await res.json() უნდა იყოს.',
    },
];

/**
 * Each step has a rank. Steps that may swap places share a rank,
 * so any order where ranks never go down is accepted.
 */
const PUZZLES = [
    {
        title: 'მასივი ეკრანზე',
        goal: 'ხილის მასივი სიად უნდა გამოჩნდეს ეკრანზე.',
        topics: ['variables', 'loops', 'dom'],
        steps: [
            { rank: 1, code: "const fruits = ['ვაშლი', 'მსხალი', 'ატამი'];" },
            { rank: 1, code: "const list = document.querySelector('#list');" },
            { rank: 2, code: 'fruits.forEach((fruit) => {' },
            { rank: 3, code: "  const li = document.createElement('li');" },
            { rank: 4, code: '  li.textContent = fruit;' },
            { rank: 4, code: '  list.append(li);' },
            { rank: 5, code: '});' },
        ],
        run(preview) {
            const fruits = ['ვაშლი', 'მსხალი', 'ატამი'];
            const list = document.createElement('ul');
            list.className = 'demo-list';
            preview.append(list);
            fruits.forEach((fruit, i) => {
                const li = document.createElement('li');
                li.textContent = fruit;
                li.style.animationDelay = `${i * 120}ms`;
                list.append(li);
            });
        },
    },
    {
        title: 'ქულების შემოწმება',
        goal: 'დაბეჭდე მხოლოდ ის ქულები, რომლებიც 60-ზე მეტი ან ტოლია.',
        topics: ['variables', 'loops', 'conditions'],
        steps: [
            { rank: 1, code: 'const scores = [45, 82, 67, 91];' },
            { rank: 2, code: 'for (const score of scores) {' },
            { rank: 3, code: '  if (score >= 60) {' },
            { rank: 4, code: "    console.log(score + ' ჩააბარა');" },
            { rank: 5, code: '  }' },
            { rank: 6, code: '}' },
        ],
        run(preview) {
            const scores = [45, 82, 67, 91];
            const lines = [];
            for (const score of scores) {
                if (score >= 60) lines.push(`${score} ჩააბარა`);
            }
            preview.append(consoleBox(lines));
        },
    },
    {
        title: 'ფოთლების ფილტრი',
        goal: 'შექმენი ფოთლები კლასით და დაითვალე ყვითლები.',
        topics: ['classes', 'functions', 'variables'],
        steps: [
            { rank: 1, code: 'class Leaf {\n  constructor(color) { this.color = color; }\n}' },
            { rank: 1, code: "const colors = ['green', 'yellow', 'green', 'yellow'];" },
            { rank: 2, code: 'const leaves = colors.map((c) => new Leaf(c));' },
            { rank: 3, code: "const yellow = leaves.filter((l) => l.color === 'yellow');" },
            { rank: 4, code: 'console.log(yellow.length); // 2' },
        ],
        run(preview) {
            class Leaf { constructor(color) { this.color = color; } }
            const leaves = ['green', 'yellow', 'green', 'yellow'].map(c => new Leaf(c));
            const yellow = leaves.filter(l => l.color === 'yellow');
            const row = document.createElement('div');
            row.className = 'demo-leaves';
            row.innerHTML = leaves.map(l => `<span class="demo-leaf ${l.color === 'yellow' ? 'dry' : ''}">${icon('leaf')}</span>`).join('');
            preview.append(row, consoleBox([`yellow.length = ${yellow.length}`]));
        },
    },
    {
        title: 'მთვლელი ღილაკი',
        goal: 'ღილაკი ითვლის დაჭერებს და რიცხვი გვერდის განახლების შემდეგაც რჩება.',
        topics: ['dom', 'bom', 'functions'],
        steps: [
            { rank: 1, code: "const btn = document.querySelector('#counter');" },
            { rank: 1, code: "let count = Number(localStorage.getItem('count')) || 0;" },
            { rank: 2, code: 'btn.textContent = count;' },
            { rank: 3, code: "btn.addEventListener('click', () => {" },
            { rank: 4, code: '  count++;' },
            { rank: 5, code: "  localStorage.setItem('count', count);" },
            { rank: 5, code: '  btn.textContent = count;' },
            { rank: 6, code: '});' },
        ],
        run(preview) {
            const KEY = 'js-leaves-counter';
            const read = () => { try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; } };
            let count = read();
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn--primary demo-counter';
            btn.textContent = count;
            btn.addEventListener('click', () => {
                count++;
                try { localStorage.setItem(KEY, count); } catch { /* ignore */ }
                btn.textContent = count;
            });
            const note = document.createElement('p');
            note.className = 'demo-note';
            note.textContent = 'დააჭირე ღილაკს, მერე გვერდი განაახლე: რიცხვი დარჩება.';
            preview.append(btn, note);
        },
    },
    {
        title: 'API-დან სახელები',
        goal: 'სერვერიდან წამოიღე მომხმარებლები და მათი სახელები აჩვენე.',
        topics: ['api', 'functions', 'dom'],
        steps: [
            { rank: 1, code: 'async function showUsers() {' },
            { rank: 2, code: "  const res = await fetch('https://jsonplaceholder.typicode.com/users');" },
            { rank: 3, code: '  const users = await res.json();' },
            { rank: 4, code: '  const names = users.map((u) => u.name);' },
            { rank: 5, code: "  output.textContent = names.join(', ');" },
            { rank: 6, code: '}' },
            { rank: 7, code: 'showUsers();' },
        ],
        async run(preview) {
            const box = consoleBox(['იტვირთება...']);
            preview.append(box);
            try {
                const res = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const users = await res.json();
                box.textContent = users.slice(0, 5).map(u => u.name).join(', ') + ' …';
            } catch (err) {
                box.textContent = `ვერ ჩაიტვირთა (${err.message}). შეამოწმე ინტერნეტი.`;
                box.classList.add('is-error');
            }
        },
    },
];

/** answer: index into options */
const OUTPUTS = [
    {
        code: 'console.log(typeof []);',
        options: ["'array'", "'object'", "'list'", 'undefined'],
        answer: 1,
        explain: 'მასივი JS-ში ობიექტის სახეობაა, ამიტომ typeof "object"-ს აბრუნებს. მასივის შესამოწმებლად Array.isArray() გამოიყენე.',
    },
    {
        code: "console.log('5' + 3);\nconsole.log('5' - 3);",
        options: ['8 და 2', "'53' და 2", "'53' და '2'", 'შეცდომა'],
        answer: 1,
        explain: "+ სტრიქონთან ტექსტს აერთებს ('53'), - კი მხოლოდ რიცხვებზე მუშაობს და '5'-ს რიცხვად აქცევს (2).",
    },
    {
        code: 'let x = 1;\n{\n  let x = 2;\n}\nconsole.log(x);',
        options: ['1', '2', 'undefined', 'ReferenceError'],
        answer: 0,
        explain: 'let ბლოკის scope-ს ემორჩილება: შიგნით შექმნილი x სხვა ცვლადია და ბლოკის გარეთ არ ჩანს.',
    },
    {
        code: 'for (var i = 0; i < 3; i++) {}\nconsole.log(i);',
        options: ['undefined', '2', '3', 'ReferenceError'],
        answer: 2,
        explain: 'var ბლოკს არ ემორჩილება, ამიტომ i ციკლის შემდეგაც ცოცხალია. ციკლი მაშინ ჩერდება, როცა i ხდება 3.',
    },
    {
        code: "function greet() {\n  console.log('გამარჯობა');\n}\nconst r = greet();\nconsole.log(r);",
        options: ["'გამარჯობა' და undefined", "'გამარჯობა' ორჯერ", 'მხოლოდ undefined', 'null'],
        answer: 0,
        explain: 'greet ჯერ ბეჭდავს „გამარჯობა“-ს, მაგრამ return არ აქვს (void), ამიტომ r არის undefined.',
    },
    {
        code: 'const a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);',
        options: ['2', '3', 'undefined', 'შეცდომა'],
        answer: 1,
        explain: 'b = a მასივს არ აკოპირებს: ორივე ერთსა და იმავე მასივზე მიუთითებს, ამიტომ b.push(3) a-საც ცვლის.',
    },
    {
        code: "console.log(0 || 'ნაგულისხმევი');\nconsole.log(5 && 'კი');",
        options: ['0 და 5', "'ნაგულისხმევი' და 'კი'", 'true და true', "'ნაგულისხმევი' და 5"],
        answer: 1,
        explain: '|| პირველ truthy მნიშვნელობას აბრუნებს (0 falsy-ა). && კი, თუ პირველი truthy-ა, მეორეს აბრუნებს.',
    },
    {
        code: 'console.log([1, 2, 3].map((n) => n * 2));',
        options: ['[1, 2, 3]', '[2, 4, 6]', '6', '12'],
        answer: 1,
        explain: 'map ყოველ ელემენტს ფუნქციაში ატარებს და შედეგებით ახალ მასივს ქმნის.',
    },
    {
        code: "console.log(5 == '5');\nconsole.log(5 === '5');",
        options: ['true და true', 'false და false', 'true და false', 'false და true'],
        answer: 2,
        explain: '== ტიპს გარდაქმნის და მერე ადარებს, === კი ტიპსაც ამოწმებს: number და string სხვადასხვაა.',
    },
    {
        code: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nconsole.log('C');",
        options: ['A B C', 'A C B', 'B A C', 'C A B'],
        answer: 1,
        explain: 'setTimeout 0-ითაც კი კოდს რიგში აყენებს და მიმდინარე კოდის დასრულების შემდეგ უშვებს, ამიტომ B ბოლოს იბეჭდება.',
    },
    {
        code: 'class Counter {\n  count = 0;\n  inc() { this.count++; return this; }\n}\nconsole.log(new Counter().inc().inc().count);',
        options: ['0', '1', '2', 'undefined'],
        answer: 2,
        explain: 'inc() this-ს აბრუნებს, ამიტომ მეთოდები ერთმანეთზე გადაება (chaining). count ორჯერ გაიზარდა.',
    },
    {
        code: "const user = { name: 'ნინო' };\nconsole.log(user.age);",
        options: ['null', 'undefined', '0', 'ReferenceError'],
        answer: 1,
        explain: 'ობიექტის არარსებული თვისება შეცდომას არ ისვრის, უბრალოდ undefined-ს აბრუნებს.',
    },
];

/** Small fake console used by the puzzle demos. */
function consoleBox(lines) {
    const box = document.createElement('pre');
    box.className = 'demo-console';
    box.textContent = lines.join('\n');
    return box;
}
