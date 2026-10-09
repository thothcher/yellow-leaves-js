'use strict';

/* Quiz: which topic does this snippet belong to? */

const QUIZ = [
    { code: 'let score = 0;', answer: 'variables', explain: 'let-ით ვქმნით ცვლადს და მასში რიცხვს ვინახავთ.' },
    { code: "const user = { name: 'ნინო', age: 21 };", answer: 'variables', explain: 'const ცვლადი, რომელშიც ობიექტი ინახება.' },
    { code: 'if (age >= 18) {\n  access = true;\n}', answer: 'conditions', explain: 'if ამოწმებს პირობას და კოდს მხოლოდ მაშინ უშვებს, როცა ის true-ა.' },
    { code: "switch (day) {\n  case 1: name = 'ორშაბათი'; break;\n}", answer: 'conditions', explain: 'switch ერთ მნიშვნელობას რამდენიმე ვარიანტს ადარებს.' },
    { code: "const text = isOk ? 'კი' : 'არა';", answer: 'conditions', explain: 'ternary ოპერატორი მოკლე if/else-ია.' },
    { code: 'for (let i = 0; i < 10; i++) {\n  total += i;\n}', answer: 'loops', explain: 'for ციკლი კოდს 10-ჯერ იმეორებს.' },
    { code: 'while (lives > 0) {\n  play();\n}', answer: 'loops', explain: 'while იმეორებს, სანამ პირობა true-ა.' },
    { code: 'function sum(a, b) {\n  return a + b;\n}', answer: 'functions', explain: 'ფუნქციის declaration, რომელიც return-ით შედეგს აბრუნებს.' },
    { code: 'const double = n => n * 2;', answer: 'functions', explain: 'arrow ფუნქცია, რომელიც შედეგს ავტომატურად აბრუნებს.' },
    { code: 'class Tree {\n  constructor(name) {\n    this.name = name;\n  }\n}', answer: 'classes', explain: 'class და constructor ობიექტის ნახაზს აღწერს.' },
    { code: "const cat = new Animal('კატა');", answer: 'classes', explain: 'new კლასიდან ახალ ეგზემპლარს ქმნის.' },
    { code: "document.querySelector('.btn')", answer: 'dom', explain: 'document-ში ელემენტის ძებნა DOM-ია.' },
    { code: "btn.addEventListener('click', go);", answer: 'dom', explain: 'DOM ელემენტზე მოვლენის მოსმენა.' },
    { code: "el.classList.add('active');", answer: 'dom', explain: 'ელემენტის კლასების შეცვლა DOM-ის მეთოდით.' },
    { code: "localStorage.setItem('theme', 'dark');", answer: 'bom', explain: 'localStorage ბრაუზერის მეხსიერებაა, ანუ BOM.' },
    { code: 'console.log(window.innerWidth);', answer: 'bom', explain: 'ფანჯრის ზომა window ობიექტიდან მოდის, ეს BOM-ია.' },
    { code: 'setTimeout(() => alert(\'დრო!\'), 2000);', answer: 'bom', explain: 'setTimeout და alert window-ის (BOM) ფუნქციებია.' },
    { code: "fetch('/api/users')\n  .then(r => r.json());", answer: 'api', explain: 'fetch სერვერს მოთხოვნას უგზავნის, ეს API-სთან მუშაობაა.' },
    { code: 'const res = await fetch(url);\nconst data = await res.json();', answer: 'api', explain: 'async/await და fetch: მონაცემი API-დან მოდის.' },
    { code: "const colors = ['მწვანე', 'ყვითელი'];", answer: 'variables', explain: 'const ცვლადი, რომელშიც მასივი ინახება.' },
    { code: 'let isOpen = false;\nisOpen = true;', answer: 'variables', explain: 'let ცვლადს მნიშვნელობა შეგვიძლია შევუცვალოთ.' },
    { code: "if (!name) {\n  name = 'სტუმარი';\n}", answer: 'conditions', explain: 'if ამოწმებს, ცარიელია (falsy) თუ არა name.' },
    { code: 'for (const item of cart) {\n  sum += item.price;\n}', answer: 'loops', explain: 'for...of მასივის ყოველ ელემენტს გადის.' },
    { code: 'do {\n  n--;\n} while (n > 0);', answer: 'loops', explain: 'do...while ერთხელ მაინც შესრულდება, მერე პირობას ამოწმებს.' },
    { code: "function greet(name = 'მეგობარო') {\n  console.log('გამარჯობა, ' + name);\n}", answer: 'functions', explain: 'ფუნქცია default პარამეტრით. return არ აქვს, ანუ void-ია.' },
    { code: 'button.onclick = function () {\n  count++;\n};', answer: 'functions', explain: 'ანონიმური ფუნქცია, რომელიც ცვლადს ენიჭება.' },
    { code: "class Dog extends Animal {\n  bark() { return 'ვაუ'; }\n}", answer: 'classes', explain: 'extends: კლასი მეორე კლასისგან იღებს მემკვიდრეობას.' },
    { code: 'class Counter {\n  static count = 0;\n}', answer: 'classes', explain: 'static ველი კლასს ეკუთვნის და არა ცალკეულ ობიექტს.' },
    { code: "const li = document.createElement('li');\nlist.append(li);", answer: 'dom', explain: 'ახალი ელემენტის შექმნა და გვერდზე ჩასმა DOM-ია.' },
    { code: "location.href = '/login';", answer: 'bom', explain: 'location ბრაუზერის მისამართია, ანუ BOM.' },
    { code: "await fetch('/api/posts', {\n  method: 'POST',\n  body: JSON.stringify(post),\n});", answer: 'api', explain: 'POST მოთხოვნა სერვერზე მონაცემს აგზავნის.' },
    { code: 'if (!res.ok) throw new Error(res.status);', answer: 'api', explain: 'res.ok fetch-ის პასუხის სტატუსს ამოწმებს.' },
];

const QUIZ_LENGTH = 12;
