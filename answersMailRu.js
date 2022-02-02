class Observer {
	#repList = null;
	#commentList = null;
	#ignoreList = JSON.parse(localStorage.getItem('ignoreList')) || [];
	#questionList = null;
	#isListChanged = false;
	#currentUserLink = document.querySelector('.pm-toolbar__button__inner_avatar')
		.href;

	run() {
		this.#observeAnswers({ interval: 1000 });
		this.#observeComments({ interval: 1000 });
		this.#observeQuestions({ interval: 1000 });
		this.#createUI();
	}

	#observeAnswers({ interval }) {
		setInterval(() => {
			this.#repList = document.querySelectorAll('.O7e15');

			if (!this.#repList) {
				return;
			}

			this.#filterList(this.#repList);
		}, interval);
	}

	#observeComments({ interval }) {
		setInterval(() => {
			this.#commentList = document.querySelectorAll('.fUImZ');

			if (!this.#commentList) {
				return;
			}

			this.#filterList(this.#commentList);
		}, interval);
	}

	#observeQuestions({ interval }) {
		setInterval(() => {
			this.#questionList = document.querySelectorAll('div.HPxqQ');

			if (!this.#questionList) {
				return;
			}

			this.#filterQuestions(this.#questionList);
		}, interval);
	}

	#filterQuestions(list) {
		if (!list) return;

		for (let node of list) {
			node.style.position = 'relative';

			let link = node.querySelector('a.ieH_k');

			if (!link.dataLoaded) {
				let ignoreLink = document.createElement('a');
				ignoreLink.style.position = 'absolute';
				ignoreLink.style.left = 0;
				ignoreLink.style.top = 0;

				ignoreLink.innerText = 'Ignore';
				ignoreLink.style.fontSize = '0.7rem';
				ignoreLink.href = '#';

				ignoreLink.addEventListener('click', () => {
					this.#addToIgnoreList(link);
				});

				if (link.href !== this.#currentUserLink) {
					node.append(ignoreLink);
				}

				link.dataLoaded = true;
			}

			this.#ignoreList.forEach(elemLink => {
				if (link.href.includes(elemLink.url)) {
					node.remove();
				}
			});
		}
	}

	#filterList(list) {
		for (let node of list) {
			let link = node.querySelector('._yoNC');

			if (!link.dataLoaded) {
				let ignoreLink = document.createElement('a');
				ignoreLink.innerText = '[ Ignore ]';
				ignoreLink.href = '#';

				ignoreLink.addEventListener('click', () => {
					this.#addToIgnoreList(link);
				});

				if (link.href !== this.#currentUserLink) {
					link.append(ignoreLink);
				}

				link.dataLoaded = true;
			}

			this.#ignoreList.forEach(elemLink => {
				if (link.href.includes(elemLink.url)) {
					node.remove();
				}
			});
		}
	}

	#addToIgnoreList(linkElem) {
		this.#ignoreList.push({
			url: linkElem.href,
			name: linkElem.innerText.split('[ Ignore ]')[0],
		});
		localStorage.setItem('ignoreList', JSON.stringify(this.#ignoreList));
	}

	#removeFromIgnoreList(item) {
		this.#ignoreList = this.#ignoreList.filter(user => {
			return user.url !== item.url;
		});

		localStorage.setItem('ignoreList', JSON.stringify(this.#ignoreList));
	}

	#createUIWindow({ width, height }) {
		let win = window.open(
			'about:blank',
			'Moderator Service',
			`width=${width},height=${height}`
		);

		return win;
	}

	#createServiceButton() {
		let button = document.createElement('button');
		button.innerText = 'Black List';

		button.style.width = '150px';
		button.style.height = '50px';
		button.style.position = 'fixed';
		button.style.left = 0;
		button.style.bottom = '10px';
		button.style.zIndex = 999999;
		button.style.border = '1px dashed green';

		button.onmouseover = () => {
			button.style.cursor = 'pointer';
		};

		document.body.append(button);
		return button;
	}

	#createUI() {
		let win = null;
		let serviceButton = this.#createServiceButton();

		serviceButton.onclick = () => {
			win = this.#createUIWindow({ width: 400, height: 300 });
			this.#isListChanged = false;

			win.document.body.insertAdjacentHTML('afterbegin', '<h1>BlackList</h1>');

			let ol = win.document.createElement('ol');

			this.#ignoreList.forEach(item => {
				let li = win.document.createElement('li');
				let profileLink = win.document.createElement('a');
				let deleteLink = win.document.createElement('a');

				deleteLink.innerText = '[ Remove ]';
				profileLink.innerText = '[ Profile ]';
				profileLink.href = item.url;

				deleteLink.onmouseover = () => {
					deleteLink.style.cursor = 'pointer';
				};

				li.append(item.name, profileLink, deleteLink);

				deleteLink.onclick = () => {
					this.#removeFromIgnoreList(item);
					this.#isListChanged = true;
					li.remove();
				};

				ol.append(li);
			});

			win.document.body.append(ol);

			win.onbeforeunload = () => {
				if (this.#isListChanged) {
					location.reload();
				}
			};
		};
	}
}

let observer = new Observer();
observer.run();
