// [Developer Agent] - JavaScript Logic for Aegis Atlas MVP
let currentXp = 14250;

document.addEventListener('DOMContentLoaded', () => {
    
    const navItems = document.querySelectorAll('.nav-item');
    const viewContainer = document.getElementById('view-container');
    
    // View Management System
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            e.currentTarget.classList.add('active');
            
            // Get target view ID
            const targetId = e.currentTarget.getAttribute('data-target');
            
            // Update breadcrumbs
            const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
            breadcrumbCurrent.textContent = e.currentTarget.querySelector('span').textContent;
            
            // Render View
            renderView(targetId);
        });
    });
});

// Mock backend API router (runs client side for MVP)
function renderView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    
    let targetView = document.getElementById(viewId);
    
    // If view doesn't exist yet, we generate it dynamically
    if (!targetView) {
        targetView = document.createElement('div');
        targetView.id = viewId;
        targetView.className = 'view active';
        
        // Inject content based on route
        targetView.innerHTML = generateViewContent(viewId);
        document.getElementById('view-container').appendChild(targetView);
    } else {
        targetView.classList.add('active');
    }
}

// Generates dynamic UI components for the MVP based on the Module requirements
function generateViewContent(viewId) {
    
    const moduleMap = {
        'learning-map': {
            icon: 'fa-route',
            title: 'Learning Map & Skill Tree',
            desc: 'A duolingo-style progression tree. Tracks your mastery across Python, Networking, and Cybersecurity.'
        },
        'coding-labs': {
            icon: 'fa-terminal',
            title: 'Secure Interactive Coding Labs',
            desc: 'Sandboxed environment to experiment with malware analysis, network scanning, and AI development.'
        },
        'ai-tutor': {
            icon: 'fa-robot',
            title: 'AI Tutor & Assistant',
            desc: 'Context-aware AI bot ready to analyze your code, explain complex architectures, or generate new exercises.'
        },
        'exam-simulator': {
            icon: 'fa-clipboard-check',
            title: 'Certification Exam Simulator',
            desc: 'Mock testing environments tracking readiness for SecurityX, CAISA, and AWS Architect.'
        },
        // Certifications & Curriculums
        'security-certs': {
            icon: 'fa-certificate',
            title: 'Security Certifications Pathway',
            desc: 'Curriculum map for SecurityX, Security AI+, CAISA, AISECARCH, SC-100, and CSAAA.'
        },
        'cloud-arch': {
            icon: 'fa-cloud',
            title: 'Cloud Architecture Maps',
            desc: 'Study paths for AWS Solutions Architect and Google Cloud Architect.'
        },
        'ai-arch': {
            icon: 'fa-network-wired',
            title: 'AI Architecture Research',
            desc: 'Advanced module for exploring state-of-the-art AI threat detection and LLM system designs.'
        },
        'languages': {
            icon: 'fa-language',
            title: 'Language Lab (3 Tracks)',
            desc: 'Embedded language acquisition engine for: Spanish, French, and Arabic.'
        }
    };

    const moduleInfo = moduleMap[viewId] || { icon: 'fa-shield', title: 'Construction Zone', desc: 'Agent Developer is currently building this module...' };

    // Custom Interactive Labs View Injection
    if (viewId === 'coding-labs') {
        return `
        <div class="lab-workspace">
            <!-- Left Pane: Curriculum & AI Tutor -->
            <div class="lab-sidebar glass-panel">
                
                <div class="lab-instructions">
                    <div class="header-badge">
                        <span>Python</span>
                        <span class="level"><i class="fa-solid fa-star"></i> Intermediate</span>
                    </div>
                    <h2>Building a Port Scanner</h2>
                    <p class="objective">Write a script that attempts to connect to ports 80, 443, and 22 on the target IP <code>192.168.1.100</code>.</p>
                    
                    <ul class="task-list">
                        <li><i class="fa-regular fa-circle"></i> Import the socket library</li>
                        <li><i class="fa-regular fa-circle"></i> Define a target IP variable</li>
                        <li><i class="fa-regular fa-circle"></i> Loop through ports [22, 80, 443]</li>
                        <li><i class="fa-regular fa-circle"></i> Print 'Port open' if connection successful</li>
                    </ul>
                </div>

                <!-- AI Tutor Chat Interface -->
                <div class="ai-tutor-panel">
                    <div class="tutor-header">
                        <i class="fa-solid fa-robot"></i> Aegis AI Tutor
                    </div>
                    <div class="tutor-chat-window">
                        <div class="tutor-msg msg-ai">
                            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                            <div class="bubble">Hello Director. I see you are working on the Python Port Scanner lab. Do you need a hint on how to use the <code>socket.connect_ex()</code> method?</div>
                        </div>
                    </div>
                    <div class="tutor-input">
                        <input type="text" placeholder="Ask AI Tutor for a hint..." id="tutor-query">
                        <button onclick="sendMockAiMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>

            </div>

            <!-- Right Pane: Code Editor & Execution -->
            <div class="lab-main glass-panel">
                
                <div class="editor-header">
                    <div class="tabs">
                        <div class="tab active"><i class="fa-brands fa-python"></i> scanner.py</div>
                        <div class="tab"><i class="fa-solid fa-gear"></i> requirements.txt</div>
                    </div>
                    <div class="actions">
                        <button class="action-btn outline btn-sm" onclick="addXP()"><i class="fa-solid fa-lightbulb"></i> Hint (-10 XP)</button>
                        <button class="action-btn glow-effect btn-sm" onclick="runMockCode()"><i class="fa-solid fa-play"></i> Run Code</button>
                    </div>
                </div>
                
                <!-- Mock Monaco Editor -->
                <div class="code-editor-area" id="mock-editor">
<pre><code><span class="kw">import</span> socket
<span class="kw">import</span> sys
<span class="comment"># Aegis Atlas Lab: TCP Port Scanner</span>

target_ip = <span class="str">"192.168.1.100"</span>
ports = [<span class="num">22</span>, <span class="num">80</span>, <span class="num">443</span>]

<span class="kw">def</span> <span class="func">scan_ports</span>(ip, port_list):
    <span class="kw">for</span> port <span class="kw">in</span> port_list:
        <span class="comment"># TODO: Initialize socket connection and test ports here</span>
        <span class="kw">pass</span>

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    scan_ports(target_ip, ports)</code></pre>
                </div>

                <!-- Execution Terminal -->
                <div class="terminal-area">
                    <div class="term-header">Terminal / Output Matrix</div>
                    <div class="term-content" id="terminal-output">
                        <span style="color: #8B949E">[Aegis Secure Container]</span> Initialized Pyodide Wasm Sandbox.<br>
                        Ready for execution...
                    </div>
                </div>

            </div>
        </div>
        `;
    }

    return `
        <h1 class="view-title">${moduleInfo.title}</h1>
        <p class="view-subtitle">${moduleInfo.desc}</p>
        
        <div class="temp-view-content glass-panel">
            <i class="fa-solid ${moduleInfo.icon}"></i>
            <h2>Module Framework Online</h2>
            <p>The Developer Agent has scaffolded this view. Awaiting Curriculum Engine data to populate actual components.</p>
            <button class="action-btn glow-effect" style="margin-top:20px;" onclick="addXP()">Simulate Action (+50 XP)</button>
        </div>
    `;
}

// Gamification Logic Test
window.addXP = function() {
    currentXp += 50;
    const xpCounter = document.getElementById('total-xp');
    xpCounter.textContent = currentXp.toLocaleString() + " XP";
    xpCounter.style.color = "#00e5ff";
    xpCounter.style.transform = "scale(1.1)";
    
    setTimeout(() => {
        xpCounter.style.color = "white";
        xpCounter.style.transform = "scale(1)";
    }, 300);
}

window.startModule = function() {
    alert("[Learning Coach]: Routing you into the interactive lab environment. (Dev Note: Redirect logic pending view implementation)");
}

// Mock Action: Terminal Execution Simulation
window.runMockCode = function() {
    const terminal = document.getElementById('terminal-output');
    if (!terminal) return;

    terminal.innerHTML += `<br><span style="color: white">> python3 scanner.py</span>`;
    
    // Simulate loading execution delay
    setTimeout(() => {
        terminal.innerHTML += `<br><span style="color: #FF6B00">[WARNING]</span> Connection refused on 192.168.1.100:22`;
        terminal.innerHTML += `<br><span style="color: #00E5FF">[SUCCESS]</span> Port 80 Open on 192.168.1.100`;
        terminal.innerHTML += `<br><span style="color: #00E5FF">[SUCCESS]</span> Port 443 Open on 192.168.1.100`;
        terminal.innerHTML += `<br><br><span style="color: #FFD700">✓ Lab Completed Automatically (Mock Environment)</span>`;
        window.addXP(); // Add XP for finishing lab
    }, 800);
}

// Mock Action: AI Tutor Chat
window.sendMockAiMessage = function() {
    const input = document.getElementById('tutor-query');
    const chatWindow = document.querySelector('.tutor-chat-window');
    
    if (!input || !chatWindow || input.value.trim() === '') return;

    // Append user message
    const userMsg = input.value;
    chatWindow.innerHTML += `
        <div class="tutor-msg msg-user animate-fade-in">
            <div class="avatar"><i class="fa-solid fa-user-astronaut"></i></div>
            <div class="bubble">${userMsg}</div>
        </div>
    `;
    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Simulate AI thinking and response
    setTimeout(() => {
        chatWindow.innerHTML += `
            <div class="tutor-msg msg-ai animate-fade-in">
                <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="bubble">I'm currently a mock interface, but when connected to the backend AWS Fargate engine via Next.js, I'll be able to read everything in your <code>scanner.py</code> file and guide you interactively!</div>
            </div>
        `;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1000);
}
