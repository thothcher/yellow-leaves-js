'use strict';

/* =========================================================
   PRACTICE DATA
   BUGS     — find the line with the bug
   OUTPUTS  — predict what the code prints
   (PUZZLES live in puzzles.js)
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
