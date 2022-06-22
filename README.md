<p align='center'>
<img src="https://raw.githubusercontent.com/NaturalSelectionLabs/CrossSync/b600f5dd2b7e8c38886a7ea58b5589577e4fabb5/src/assets/logo.png" alt="CrossSync Logo" width="60" height="60" />
</p>

<h1  align='center'>CrossSync</h1>

> Welcome to CrossSync! 👋

<span align='center'>

[![test-build](https://img.shields.io/github/workflow/status/NaturalSelectionLabs/CrossSync/Build%20test%20pack?label=test%20build&style=for-the-badge)](https://github.com/NaturalSelectionLabs/CrossSync/actions/workflows/build-test.yml)
[![release-build](https://img.shields.io/github/workflow/status/NaturalSelectionLabs/CrossSync/Build%20release%20pack?label=release%20build&style=for-the-badge)](https://github.com/NaturalSelectionLabs/CrossSync/actions/workflows/build-release.yml)
[![release](https://img.shields.io/github/v/release/NaturalSelectionLabs/CrossSync?color=%235d66f5&style=for-the-badge)](https://github.com/NaturalSelectionLabs/CrossSync/releases)
[![chrome web store](https://img.shields.io/chrome-web-store/v/cilehfhekljoecdbbimgebbncpjagmon?color=%23f55d66&style=for-the-badge)](https://chrome.google.com/webstore/detail/crosssync/cilehfhekljoecdbbimgebbncpjagmon)

[![available in chrome web store](https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/crosssync/cilehfhekljoecdbbimgebbncpjagmon)

</span>

---

## 🐳 Introduction

CrossSync is a socially-oriented web3 Dapp that runs on the Crossbell. CrossSync aims to allow a user-owned flow of social information.

Crossbell allows users the ability to take back their data ownership; CrossSync makes owning your data a fun and engaging social experience.

To get started, you’ll need go to [Crossbell Faucet](https://faucet.crossbell.io) and get some $CSB. After you’ve connected your wallet and received the $CSB, you’ll be able to mint a profile on CrossSync.

## 🪙 Special

You can find us [on Gitcoin](https://gitcoin.co/grants/6465/crosssync) !

## 🎁 Installation

The latest stable version can be grabbed from [Release Page](https://github.com/NaturalSelectionLabs/CrossSync/releases) with zipped file attached.

You can also migrate to [Chrome Web Store](https://chrome.google.com/webstore/detail/crosssync/cilehfhekljoecdbbimgebbncpjagmon) for the published version. It might have some latency than the Release version because Google need to review it before publish.

## ⚙ Development

1. Build dev pack

    - pnpm (recommended)

        ```shell
        pnpm install
        pnpm dev
        ```

2. Navigate to `chrome://extensions/`

3. Open `Developer mode` in the top right corner

4. Click `Load unpacked` in the top left corner

5. Select `path/to/CrossSync/dist`

## 🔨 Builds

### Release builds

You can navigate to [Release page](https://github.com/NaturalSelectionLabs/CrossSync/releases) for the release packs.

### Test builds

You can navigate to [Workflow Run page](https://github.com/NaturalSelectionLabs/CrossSync/actions/workflows/build-test.yml) for the test artifacts. If they are expired, you can build your own pack.

### Build by yourself

-   pnpm (recommended)

    ```shell
    pnpm build
    ```
