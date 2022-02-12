// mirrorText();

function mirrorText() {
	let dd = document.getElementsByClassName('jdGbV');
	$(function () {
		dd[0].style.transform = 'scale(-1, 1)';
	});
	// $(function () {
	// 	doucument.body.style.color = 'green';
	// });
}

class Observer {
	#repList = null;
	#commentList = null;
	#ignoreList = JSON.parse(localStorage.getItem('ignoreList')) || [];
	#questionList = null;
	#isListChanged = false;
	#currentUserLink = document.querySelector('.pm-toolbar__button__inner_avatar')
		.href;
	#win = null;

	run() {
		this.#observeAll({ interval: 1000 });
		this.#createUI();
	}

	#observeAll({ interval }) {
		setInterval(() => {
			this.#observeQuestions();
			this.#observeAnswers();
			this.#observeComments();
		}, interval);
	}

	#createUI() {
		let serviceButton = this.#createServiceButton();

		serviceButton.onclick = () => {
			this.#win = this.#createUIWindow({ width: 400, height: 300 });
			this.#isListChanged = false;

			this.#win.document.body.insertAdjacentHTML(
				'afterbegin',
				`<h1>BlackList (${this.#ignoreList.length})</h1>`
			);

			this.#setBlackListUI();

			this.#win.onbeforeunload = () => {
				if (this.#isListChanged) {
					location.reload();
				}
			};

			this.#showDownloadBlackList();
			this.#showUploadBlackList();
		};
	}

	#observeAnswers() {
		this.#repList = document.querySelectorAll('.O7e15');

		if (!this.#repList) {
			return;
		}

		this.#filterList(this.#repList);
	}

	#observeComments() {
		this.#commentList = document.querySelectorAll('.fUImZ');

		if (!this.#commentList) {
			return;
		}

		this.#filterList(this.#commentList);
	}

	#observeQuestions() {
		this.#questionList = document.querySelectorAll('div.HPxqQ');

		if (!this.#questionList) {
			return;
		}

		this.#filterQuestions(this.#questionList);
	}

	#filterQuestions(list) {
		if (!list) return;

		for (let node of list) {
			node.style.position = 'relative';

			let link = node.querySelector('a.ieH_k');

			if (!link.dataLoaded) {
				link.href += '/';
				let ignoreLink = document.createElement('a');
				ignoreLink.style.position = 'absolute';
				ignoreLink.style.left = 0;
				ignoreLink.style.top = 0;

				ignoreLink.innerText = 'Ignore';
				ignoreLink.style.fontSize = '0.7rem';
				ignoreLink.style.color = '#6bd089';
				ignoreLink.style.opacity = 0.6;
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
				ignoreLink.style.color = '#6bd089';
				ignoreLink.style.opacity = 0.6;

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

	#setBlackListUI() {
		let ol = this.#win.document.createElement('ol');
		let prevOl = this.#win.document.body.querySelector('ol');

		if (prevOl !== null) {
			prevOl.replaceWith(ol);
		} else {
			this.#win.document.body.append(ol);
		}

		this.#ignoreList.forEach(item => {
			let li = this.#win.document.createElement('li');
			let profileLink = this.#win.document.createElement('a');
			let deleteLink = this.#win.document.createElement('a');

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
	}

	#showDownloadBlackList() {
		let data = this.#ignoreList;
		let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

		let downloadLink = document.createElement('a');
		downloadLink.innerText = 'Download BlackList';
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.download = 'blackListOtvetiRu.json';

		this.#win.document.body.append(downloadLink);
	}

	#showUploadBlackList() {
		let fileField = document.createElement('input');
		fileField.style.display = 'block';
		fileField.style.marginTop = '10px';
		fileField.type = 'file';
		fileField.accept = 'application/json';

		let reader = new FileReader();

		reader.onload = () => {
			let userUpload = reader.result;

			if (!userUpload) return;

			try {
				let errorStatus = false;
				let settings = JSON.parse(userUpload);

				settings.forEach(({ url, name } = {}) => {
					if (!url || !name) {
						errorStatus = true;
					}
				});

				if (errorStatus) {
					alert('Wrong settings');
					return;
				}

				this.#ignoreList = [...settings];
				localStorage.setItem('ignoreList', JSON.stringify(this.#ignoreList));

				this.#refreshBlackListWindow();
			} catch (err) {
				alert('File is not a JSON format.');
			}
		};

		fileField.onchange = event => {
			let file = event.target.files[0];
			reader.readAsText(file);
		};

		this.#win.document.body.append(fileField);
	}

	#refreshBlackListWindow() {
		this.#setBlackListUI();
	}
}

let observer = new Observer();
observer.run();
