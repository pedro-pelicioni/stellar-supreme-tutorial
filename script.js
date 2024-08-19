// Módulos e lições do tutorial
const modules = [
    {
        title: "Introduction to Soroban",
        lessons: [
            {
                title: "What is Soroban?",
                content: `
                    <h3>Welcome to Soroban Development!</h3>
                    <p>Soroban is Stellar's new smart contracts platform. It's designed to be safe, scalable, and easy to use.</p>
                    <h4>Key Features:</h4>
                    <ul>
                        <li>Rust-based: Leverage Rust's safety and performance</li>
                        <li>WebAssembly: Contracts compile to Wasm for portability</li>
                        <li>Host-Contract Interface: Clear separation between on-chain and off-chain logic</li>
                    </ul>
                    <p>In the following lessons, we'll learn how to write and deploy Soroban contracts.</p>
                `,
                test: null
            },
            {
                title: "Setting Up the Environment",
                content: `
                    <h3>Preparing Your Development Environment</h3>
                    <p>Before we start coding, let's set up our environment. Here are the steps:</p>
                    <ol>
                        <li>Install Rust: <code>curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh</code></li>
                        <li>Install Soroban CLI: <code>cargo install --locked soroban-cli</code></li>
                        <li>Add Wasm target: <code>rustup target add wasm32-unknown-unknown</code></li>
                    </ol>
                    <p>These tools will allow us to compile and deploy Soroban contracts.</p>
                `,
                test: null
            }
        ]
    },
    {
        title: "Your First Soroban Contract",
        lessons: [
            {
                title: "Hello, Soroban!",
                content: `
                    <h3>Writing Your First Soroban Contract</h3>
                    <p>Let's create a simple "Hello, Soroban!" contract. Here's the code:</p>
                    <pre><code>#![no_std]
use soroban_sdk::{contractimpl, log, symbol_short, vec, Env, Symbol, Vec};

pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        log!(&env, "Hello, {}", to);
        vec![&env, symbol_short!("Hello"), to]
    }
}
</code></pre>
                    <p>This contract has a single function 'hello' that takes a name and returns a greeting.</p>
                    <p>Try writing this code in the playground.</p>
                `,
                test: (code) => {
                    return code.includes('#![no_std]') &&
                           code.includes('use soroban_sdk') &&
                           code.includes('pub struct HelloContract') &&
                           code.includes('#[contractimpl]') &&
                           code.includes('pub fn hello(env: Env, to: Symbol)');
                }
            },
            {
                title: "Understanding the Contract",
                content: `
                    <h3>Breaking Down the Hello Contract</h3>
                    <p>Let's understand the key parts of our Hello contract:</p>
                    <ul>
                        <li><code>#![no_std]</code>: This tells Rust not to include the standard library, as Soroban contracts run in a constrained environment.</li>
                        <li><code>use soroban_sdk::</code>: We import necessary types and macros from the Soroban SDK.</li>
                        <li><code>#[contractimpl]</code>: This macro generates the necessary boilerplate to make our struct a Soroban contract.</li>
                        <li><code>pub fn hello(env: Env, to: Symbol) -> Vec<Symbol></code>: This is our contract function. It takes an environment and a name, and returns a vector of symbols.</li>
                    </ul>
                    <p>In the next lesson, we'll learn how to compile and deploy this contract.</p>
                `,
                test: null
            }
        ]
    },
    {
        title: "Soroban Data Types",
        lessons: [
            {
                title: "Introduction to Soroban Types",
                content: `
                    <h3>Soroban-Specific Data Types</h3>
                    <p>Soroban provides several custom types to ensure safety and efficiency in smart contracts:</p>
                    <ul>
                        <li><code>Symbol</code>: For string-like data (max 32 characters)</li>
                        <li><code>Bytes</code>: For arbitrary byte data</li>
                        <li><code>Address</code>: For Stellar addresses</li>
                        <li><code>Vec</code>: A vector type for collections</li>
                        <li><code>Map</code>: A key-value store</li>
                        <li><code>Env</code>: Provides access to the contract's environment</li>
                    </ul>
                    <p>Let's modify our Hello contract to use more of these types.</p>
                `,
                test: null
            },
            {
                title: "Using Soroban Types",
                content: `
                    <h3>Enhanced Hello Contract</h3>
                    <p>Let's modify our contract to store greetings:</p>
                    <pre><code>#![no_std]
use soroban_sdk::{contractimpl, log, symbol_short, vec, Env, Symbol, Vec, Map};

pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        let mut greetings: Map<Symbol, u32> = Map::new(&env);
        let count = match greetings.get(to) {
            Some(val) => *val + 1,
            None => 1,
        };
        greetings.set(to, count);
        
        log!(&env, "Hello, {}! This is greeting number {}", to, count);
        vec![&env, symbol_short!("Hello"), to, count.into()]
    }
}
</code></pre>
                    <p>This version keeps track of how many times each name has been greeted.</p>
                    <p>Try implementing this in the playground.</p>
                `,
                test: (code) => {
                    return code.includes('use soroban_sdk::{') &&
                           code.includes('Map') &&
                           code.includes('let mut greetings: Map<Symbol, u32> = Map::new(&env);') &&
                           code.includes('greetings.set(to, count);');
                }
            }
        ]
    },
    {
        title: "Contract State and Storage",
        lessons: [
            {
                title: "Persistent Storage in Soroban",
                content: `
                    <h3>Using Persistent Storage</h3>
                    <p>Soroban provides a way to store data persistently across contract invocations using the <code>storage</code> module.</p>
                    <p>Let's modify our Hello contract to persistently store greeting counts:</p>
                    <pre><code>#![no_std]
use soroban_sdk::{contractimpl, log, symbol_short, vec, Env, Symbol, Vec, Map, storage};

pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        let mut greetings: Map<Symbol, u32> = storage::persistent(&env)
            .get_or_init("greetings", || Map::new(&env));
        
        let count = match greetings.get(to) {
            Some(val) => *val + 1,
            None => 1,
        };
        greetings.set(to, count);
        
        log!(&env, "Hello, {}! This is greeting number {}", to, count);
        vec![&env, symbol_short!("Hello"), to, count.into()]
    }
}
</code></pre>
                    <p>This version stores the greeting counts persistently, so they're remembered between contract calls.</p>
                    <p>Try implementing this in the playground.</p>
                `,
                test: (code) => {
                    return code.includes('use soroban_sdk::{') &&
                           code.includes('storage') &&
                           code.includes('storage::persistent(&env)') &&
                           code.includes('.get_or_init("greetings", || Map::new(&env));');
                }
            }
        ]
    },
    {
        title: "Advanced Contract Interactions",
        lessons: [
            {
                title: "Invoking Other Contracts",
                content: `
                    <h3>Cross-Contract Invocations</h3>
                    <p>Soroban allows contracts to call functions in other contracts. This enables composability and complex interactions.</p>
                    <p>Here's an example of how to invoke another contract:</p>
                    <pre><code>#![no_std]
use soroban_sdk::{contractimpl, log, symbol_short, vec, Env, Symbol, Vec, Address, IntoVal};

pub struct CallerContract;

#[contractimpl]
impl CallerContract {
    pub fn call_hello(env: Env, contract_id: Address, name: Symbol) -> Vec<Symbol> {
        let client = env.invoke_contract(&contract_id, &symbol_short!("hello"), vec![&env, name.into_val(&env)]);
        let result: Vec<Symbol> = client.try_into_val(&env).unwrap();
        log!(&env, "Result from hello contract: {:?}", result);
        result
    }
}
</code></pre>
                    <p>This contract calls the 'hello' function of another contract and returns its result.</p>
                    <p>Try implementing this in the playground.</p>
                `,
                test: (code) => {
                    return code.includes('use soroban_sdk::{') &&
                           code.includes('pub fn call_hello(env: Env, contract_id: Address, name: Symbol)') &&
                           code.includes('env.invoke_contract(&contract_id,');
                }
            }
        ]
    },
    {
        title: "Error Handling in Soroban",
        lessons: [
            {
                title: "Custom Errors and Panic",
                content: `
                    <h3>Handling Errors in Soroban Contracts</h3>
                    <p>Proper error handling is crucial for robust smart contracts. Soroban provides ways to define custom errors and use panic for irrecoverable errors.</p>
                    <p>Here's an example of custom error handling:</p>
                    <pre><code>#![no_std]
use soroban_sdk::{contractimpl, log, symbol_short, vec, Env, Symbol, Vec, contracterror};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NameTooShort = 1,
    NameTooLong = 2,
}

pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Result<Vec<Symbol>, Error> {
        let name = to.to_string();
        if name.len() < 2 {
            return Err(Error::NameTooShort);
        }
        if name.len() > 20 {
            return Err(Error::NameTooLong);
        }
        
        log!(&env, "Hello, {}", to);
        Ok(vec![&env, symbol_short!("Hello"), to])
    }
}
</code></pre>
                    <p>This contract defines custom errors and returns them when input validation fails.</p>
                    <p>Try implementing this in the playground.</p>
                `,
                test: (code) => {
                    return code.includes('#[contracterror]') &&
                           code.includes('pub enum Error {') &&
                           code.includes('pub fn hello(env: Env, to: Symbol) -> Result<Vec<Symbol>, Error>') &&
                           code.includes('return Err(Error::');
                }
            }
        ]
    },
    {
        title: "Testing Soroban Contracts",
        lessons: [
            {
                title: "Writing Unit Tests",
                content: `
                    <h3>Unit Testing Soroban Contracts</h3>
                    <p>Testing is crucial for ensuring your contracts work as expected. Soroban provides tools for writing unit tests.</p>
                    <p>Here's an example of how to write tests for our Hello contract:</p>
                    <pre><code>#[cfg(test)]
    mod test {
        use super::*;
        use soroban_sdk::Env;
    
        #[test]
        fn test_hello() {
            let env = Env::default();
            let contract_id = env.register_contract(None, HelloContract);
            let client = HelloContractClient::new(&env, &contract_id);
    
            let result = client.hello(&Symbol::short("Alice"));
            assert_eq!(
                result,
                vec![&env, Symbol::short("Hello"), Symbol::short("Alice")]
            );
        }
    
        #[test]
        #[should_panic(expected = "NameTooShort")]
        fn test_hello_name_too_short() {
            let env = Env::default();
            let contract_id = env.register_contract(None, HelloContract);
            let client = HelloContractClient::new(&env, &contract_id);
    
            client.hello(&Symbol::short("A"));
        }
    }
    </code></pre>
                    <p>These tests would verify that our contract works correctly and handles errors as expected.</p>
                    <p>Key points about testing Soroban contracts:</p>
                    <ul>
                        <li>Tests are typically placed in a separate module marked with <code>#[cfg(test)]</code>.</li>
                        <li>We use <code>Env::default()</code> to create a test environment.</li>
                        <li>The contract is registered in the test environment using <code>env.register_contract()</code>.</li>
                        <li>We create a client to interact with the contract in tests.</li>
                        <li>Assert statements are used to verify expected outcomes.</li>
                        <li>The <code>#[should_panic]</code> attribute is used for tests that should cause errors.</li>
                    </ul>
                    <p>Remember, these tests would be run using <code>cargo test</code> in your development environment, not in this playground.</p>
                `,
                test: null   
            }
        ]
    },
    {
        title: "Deploying Soroban Contracts",
        lessons: [
            {
                title: "Deploying to Testnet",
                content: `
                    <h3>Deploying Your Contract to Stellar Testnet</h3>
                    <p>Once your contract is ready, you can deploy it to the Stellar Testnet for testing in a live environment.</p>
                    <p>Here are the steps to deploy your contract:</p>
                    <ol>
                        <li>Build your contract: <code>cargo build --target wasm32-unknown-unknown --release</code></li>
                        <li>Optimize the Wasm binary: <code>soroban contract optimize --wasm target/wasm32-unknown-unknown/release/your_contract.wasm</code></li>
                        <li>Deploy to testnet: <code>soroban contract deploy --wasm target/wasm32-unknown-unknown/release/your_contract.optimized.wasm --network testnet --source SXXX...</code></li>
                    </ol>
                    <p>Remember to replace 'your_contract' with your actual contract name and 'SXXX...' with your Stellar secret key.</p>
                    <p>After deployment, you'll receive a contract ID. Save this ID as you'll need it to interact with your contract.</p>
                `,
                test: null
            }
        ]
    }
];

let currentModule = 0;
let currentLesson = 0;

function loadContent(contentType) {
    const contentElement = document.getElementById('tutorial-content');
    const playgroundElement = document.getElementById('playground');
    
    playgroundElement.style.display = 'none';  
    
    switch (contentType) {
        case 'home':
            contentElement.innerHTML = `
                <h2>Welcome to Stellar Supreme Tutorial</h2>
                <p>Learn about Soroban and how to create smart contracts for the Stellar network!</p>
                <p>Choose a module to start your journey.</p>
            `;
            break;
        case 'modules':
            let moduleList = '<h2>Available Modules(... yet 👽)</h2><ul>';
            modules.forEach((module, index) => {
                moduleList += `<li><a href="#" onclick="loadModule(${index})">${module.title}</a></li>`;
            });
            moduleList += '</ul>';
            contentElement.innerHTML = moduleList;
            break;
        case 'about':
            contentElement.innerHTML = `
                <h2>About Stellar Supreme Tutorial</h2>
                <p>This tutorial was created to help developers learn about Soroban and how to create smart contracts for the Stellar network.</p>
                <p>Developed with support from the Stellar community.</p>
            `;
            break;
    }
}

function loadModule(moduleIndex) {
    currentModule = moduleIndex;
    currentLesson = 0;
    loadLesson();
}

function loadLesson() {
    const lesson = modules[currentModule].lessons[currentLesson];
    const contentElement = document.getElementById('tutorial-content');
    const playgroundElement = document.getElementById('playground');
    
    contentElement.innerHTML = `
        <h2>${modules[currentModule].title} - ${lesson.title}</h2>
        ${lesson.content}
        <button id="next-lesson">Next Lesson</button>
    `;

    if (lesson.test) {
        playgroundElement.style.display = 'block';
        document.getElementById('run-code').addEventListener('click', runCode);
    } else {
        playgroundElement.style.display = 'none';
    }
    
    document.getElementById('next-lesson').addEventListener('click', nextLesson);
}

function runCode() {
    const code = document.getElementById('code-input').value;
    const output = document.getElementById('code-output');
    const lesson = modules[currentModule].lessons[currentLesson];
    
    if (lesson.test && lesson.test(code)) {
        output.innerHTML = "Congratulations! You've completed the challenge.";
    } else {
        output.innerHTML = "The code didn't pass the test. Make sure you've included all necessary elements:";
        output.innerHTML += "<ul>";
        output.innerHTML += "<li>Custom error enum with NameTooShort and NameTooLong</li>";
        output.innerHTML += "<li>Function signature returning Result<Vec<Symbol>, Error></li>";
        output.innerHTML += "<li>Error checks for name length</li>";
        output.innerHTML += "<li>Correct return statement for successful case</li>";
        output.innerHTML += "</ul>";
    }
}

function nextLesson() {
    currentLesson++;
    if (currentLesson >= modules[currentModule].lessons.length) {
        currentLesson = 0;
        currentModule++;
        if (currentModule >= modules.length) {
            loadContent('modules');
            return;
        }
    }
    loadLesson();
}

// Event listeners for navigation
document.getElementById('nav-home').addEventListener('click', () => loadContent('home'));
document.getElementById('nav-modules').addEventListener('click', () => loadContent('modules'));
document.getElementById('nav-about').addEventListener('click', () => loadContent('about'));

// Start with the home page
loadContent('home');