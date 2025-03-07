<template>
  <div class="position-relative">
    <div
      v-if="article !== null && article.content !== null"
      class="article-toolbar"
    >
      <div class="site-info position-relative">
        <div class="wrap w-100 h-100 d-flex align-items-center">
          <img
            :src="article.favicon"
            width="16"
            height="16"
            class="mb-0 mx-3 d-inline-flex"
          >
          <span>{{ article.sitetitle }}</span>
        </div>
      </div>
      <div class="article-buttons">
        <div class="wrap">
          <button
            v-click-outside="vcoConfig"
            v-b-tooltip.hover
            class="btn btn-toolbar"
            :title="getTranslatedLabel('Format Options')"
            @click="openSettings"
          >
            <feather-icon name="settings" />
          </button>
        </div>
        <div class="wrap">
          <button
            v-b-tooltip.hover
            class="btn btn-toolbar"
            :title="markFavouriteButton"
            @click="markFavourite"
          >
            <feather-icon
              name="star"
              :filled="articleItem.favourite"
            />
          </button>
        </div>
        <div class="wrap">
          <button
            v-b-tooltip.hover
            class="btn btn-toolbar"
            :title="markReadButton"
            @click="markRead"
          >
            <feather-icon
              name="circle"
              :filled="articleItem.read"
            />
          </button>
        </div>
        <div
          v-if="!article.podcast"
          class="wrap"
        >
          <button
            ref="openlink"
            v-b-tooltip.hover
            class="btn btn-toolbar js-external-link"
            :title="getTranslatedLabel('View original')"
            @click="openOriginal(article.link)"
          >
            <feather-icon
              name="globe"
              :success="original"
            />
          </button>
        </div>
        <div
          v-if="!article.podcast"
          class="wrap"
        >
          <button
            ref="saveoffline"
            v-b-tooltip.hover
            class="btn btn-toolbar"
            :title="getTranslatedLabel('Save article')"
            @click="saveArticle"
          >
            <feather-icon
              name="wifi-off"
              :success="articleItem.offline"
            />
          </button>
        </div>
        <div class="wrap">
          <b-dropdown
            ref="socialshare"
            variant="link"
            no-caret
            toogle-class="btn-toolbar"
          >
            <template
              slot="button-content"
              class="pt-1"
            >
              <feather-icon name="share-2" />
            </template>
            <b-dropdown-item @click="copyArticleLinkToClipboard(article.link)">
              Copy article link
            </b-dropdown-item>
            <b-dropdown-item
              v-if="instapaperConnected"
              @click="saveToInstapaper(article.link)"
            >
              Instapaper
            </b-dropdown-item>
            <b-dropdown-item
              v-if="pocketConnected"
              @click="saveToPocket(article.link)"
            >
              Pocket
            </b-dropdown-item>
            <b-dropdown-item>
              <social-sharing
                :url="article.url"
                inline-template
              >
                <network network="email">
                  Email
                </network>
              </social-sharing>
            </b-dropdown-item>
            <b-dropdown-item>
              <social-sharing
                :url="article.url"
                inline-template
              >
                <network network="facebook">
                  Facebook
                </network>
              </social-sharing>
            </b-dropdown-item>
            <b-dropdown-item>
              <social-sharing
                :url="article.url"
                inline-template
              >
                <network network="twitter">
                  Twitter
                </network>
              </social-sharing>
            </b-dropdown-item>
            <b-dropdown-item>
              <social-sharing
                :url="article.url"
                inline-template
              >
                <network network="linkedin">
                  Linkedin
                </network>
              </social-sharing>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div
          v-if="!articleItem.podcast && articleItem.media === null"
          class="wrap"
        >
          <button
            v-b-tooltip.hover
            class="btn btn-toolbar"
            :title="getTranslatedLabel('Full Content')"
            @click="loadFullArticle"
          >
            <feather-icon
              :success="fullArticle"
              name="align-justify"
            />
          </button>
        </div>
      </div>
    </div>
    <div
      tabindex="0"
      class="article-setting"
      :class="{ hidden: !settingspanel }"
    >
      <div class="settings-wrap dropdown-setting">
        <b-form-select
          v-model="fontstyle"
          class="article-settings-btn"
          :options="options"
          @change="changeFontStyle"
        />
      </div>
      <div class="settings-wrap">
        <button
          class="article-settings-btn btn btn-link"
          @click="decreaseFontSize"
        >
          <svg
            class="article-settings-btn icon-smaller-text"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
          ><path d="M17.973 29.845v-.321c.446-.051.781-.219 1.004-.504.223-.286.606-1.067 1.148-2.345l3.617-8.52h.346l4.326 9.842c.288.651.519 1.056.69 1.21s.463.26.869.316v.321h-4.415v-.321c.507-.046.835-.101.981-.166.146-.064.221-.223.221-.476a2.08 2.08 0 0 0-.086-.447 4.885 4.885 0 0 0-.236-.675l-.695-1.67h-4.575a85.484 85.484 0 0 0-.808 2.079c-.087.25-.131.448-.131.595 0 .293.119.495.356.607.146.067.423.118.829.152v.321h-3.441zm7.476-4.458l-1.989-4.782-1.999 4.782h3.988z" /></svg>
        </button>
      </div>
      <div class="settings-wrap">
        <button
          class="article-settings-btn btn btn-link"
          @click="increaseFontSize"
        >
          <svg
            class="article-settings-btn icon-smaller-text"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
          ><path d="M11.654 36v-.661c.916-.104 1.604-.448 2.062-1.034s1.244-2.191 2.356-4.812L23.499 12h.709l8.881 20.207c.592 1.338 1.063 2.166 1.419 2.482.354.317.948.534 1.783.649V36h-9.064v-.661c1.042-.093 1.713-.205 2.016-.339.301-.132.451-.458.451-.978 0-.173-.058-.479-.174-.919a9.874 9.874 0 0 0-.487-1.385l-1.427-3.429h-9.393c-.926 2.332-1.479 3.755-1.659 4.269s-.27.922-.27 1.222c0 .601.244 1.017.73 1.247.301.139.868.242 1.702.312V36h-7.062zm15.35-9.154L22.92 17.03l-4.104 9.816h8.188z" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '../services/bus'
import cheerio from '../mixins/cheerio'
import { parseArticle } from '../parsers/article'
import cacheService from '../services/cacheArticle'
import axios from 'axios'
import vClickOutside from 'v-click-outside'

const markTypes = {
  favourite: 'FAVOURITE',
  unfavourite: 'UNFAVOURITE',
  read: 'READ',
  unread: 'UNREAD',
  cache: 'CACHE',
  uncache: 'UNCACHE'
}

export default {
  directives: {
    clickOutside: vClickOutside.directive
  },
  mixins: [
    cheerio
  ],
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      articleItem: null,
      fullArticle: false,
      pocket_connected: false,
      instapaper_connected: false,
      settingspanel: false,
      fontstyle: null,
      original: false,
      options: [
        { value: null, text: 'System font' },
        { value: 'Open Sans', text: 'Open Sans' },
        { value: 'Muli', text: 'Muli' },
        { value: 'Playfair Display', text: 'Playfair Display' },
        { value: 'Roboto Slab', text: 'Roboto Slab' }
      ],
      vcoConfig: {
        handler: this.handleSetting,
        middleware: this.middleware,
        events: ['click']
      }
    }
  },
  computed: {
    markFavouriteButton () {
      return this.articleItem.favourite ? this.getTranslatedLabel('Mark as unfavourite') : this.getTranslatedLabel('Mark as favourite')
    },
    markReadButton () {
      return this.articleItem.read ? this.getTranslatedLabel('Mark as unread') : this.getTranslatedLabel('Mark as read')
    },
    instapaperConnected () {
      return this.$store.state.Setting.instapaper_connected
    },
    pocketConnected () {
      return this.$store.state.Setting.pocket_connected
    }
  },
  watch: {
    article () {
      this.articleItem = JSON.parse(JSON.stringify(this.article))
      if (this.$store.state.Setting.fullArticleDefault && this.articleItem && !this.articleItem.podcast && !this.articleItem.media) {
        this.loadFullArticle()
      }
    }
  },
  mounted () {
    this.pocket_connected = this.$store.state.Setting.pocket_connected
    this.instapaper_connected = this.$store.state.Setting.instapaper_connected
    bus.$on('change-article-list', () => {
      this.resetData()
    })
  },
  methods: {
    getTranslatedLabel (val) {
      return this.$options.filters.t(val)
    },
    copyArticleLinkToClipboard (url) {
      window.electron.copyToClipboard(url)
    },
    resetData () {
      this.original = false
      this.settingspanel = false
      this.fullArticle = false
      this.$store.dispatch('turnOnFontSetting', false)
    },
    openOriginal (url) {
      this.original = !this.original
      this.$emit('open-original-article', this.original, url)
    },
    hideTextConfig () {
      this.settingspanel = !this.settingspanel
      this.$store.dispatch('turnOnFontSetting', this.settingspanel)
    },
    changeFontStyle (fontStyle) {
      this.$store.dispatch('changeFontStyle', fontStyle)
    },
    decreaseFontSize () {
      this.$store.dispatch('decreaseFont')
    },
    increaseFontSize () {
      this.$store.dispatch('increaseFont')
    },
    markFavourite () {
      if (this.articleItem.favourite) {
        this.$store.dispatch('markAction', {
          type: markTypes.unfavourite,
          id: this.$store.state.FeedManager.activeArticleId
        }).then(() => {
          this.$store.dispatch('loadFeeds')
          this.$store.dispatch('loadArticles')
        })
      } else {
        this.$store.dispatch('markAction', {
          type: markTypes.favourite,
          id: this.$store.state.FeedManager.activeArticleId
        }).then(() => {
          this.$store.dispatch('loadFeeds')
          this.$store.dispatch('loadArticles')
        })
      }
      this.articleItem.favourite = !this.articleItem.favourite
    },
    saveArticle () {
      const self = this
      if (this.articleItem.offline && !this.$store.state.Setting.offline) {
        cacheService.uncache(`raven-${this.articleItem._id}`).then(() => {
          self.articleItem.offline = false
          self.$store.dispatch('saveArticle', {
            type: markTypes.uncache,
            article: self.articleItem
          }).then(() => {
            self.$store.dispatch('loadFeeds')
            self.$store.dispatch('loadArticles')
          })
        })
      } else {
        cacheService.cacheArticleData(self.article).then(() => {
          self.articleItem.offline = true
          self.$store.dispatch('saveArticle', {
            type: markTypes.cache,
            article: self.articleItem
          }).then(() => {
            self.$store.dispatch('loadFeeds')
            self.$store.dispatch('loadArticles')
          })
        })
      }
    },
    saveToInstapaper (url) {
      const creds = JSON.parse(this.$store.state.Setting.instapaper)
      axios.post(`https://www.instapaper.com/api/add?url=${url}`, {
      }, {
        auth: {
          username: creds.username,
          password: creds.password
        }
      }).then(() => {
        this.$toasted.show('Saved to Instapaper.', {
          theme: 'outline',
          position: 'top-center',
          duration: 3000
        })
        this.$refs.socialshare.hide(true)
      })
    },
    saveToPocket (url) {
      const credentials = JSON.parse(this.$store.state.Setting.pocket)
      axios.post('https://getpocket.com/v3/add', {
        url: url,
        access_token: credentials.access_token,
        consumer_key: credentials.consumer_key
      }).then((data) => {
        this.$toasted.show('Saved to pocket.', {
          theme: 'outline',
          position: 'top-center',
          duration: 3000
        })
        this.$refs.socialshare.hide(true)
      })
    },
    openSettings () {
      this.settingspanel = !this.settingspanel
      this.$store.dispatch('turnOnFontSetting', this.settingspanel)
    },
    markRead () {
      if (this.articleItem.read) {
        this.$store.dispatch('markAction', {
          type: markTypes.unread,
          id: this.$store.state.FeedManager.activeArticleId,
          podcast: this.articleItem.podcast
        })
      } else {
        this.$store.dispatch('markAction', {
          type: markTypes.read,
          id: this.$store.state.FeedManager.activeArticleId,
          podcast: this.articleItem.podcast
        })
      }
      this.articleItem.read = !this.articleItem.read
    },
    handleSetting (event, el) {
      if (this.settingspanel) {
        this.settingspanel = false
        this.$store.dispatch('turnOnFontSetting', this.settingspanel)
      }
    },
    middleware (event, el) {
      if (event.target.className === 'article-settings-btn custom-select' || (event.target.className.baseVal && event.target.className.baseVal.includes('article-settings-btn'))) {
        return false
      }
      return true
    },
    async loadFullArticle () {
      const fullArticle = await parseArticle(this.articleItem.link)
      if (!fullArticle.error) {
        this.articleItem.fullContent = this.cleanupContent(fullArticle.content)
        this.$emit('load-full-content', this.articleItem)
        this.fullArticle = !this.fullArticle
      } else {
        this.articleItem.fullContent = null
        this.fullArticle = !this.fullArticle
      }
    }
  }
}
</script>
<style lang="scss">

// Default color mode
:root {
  & .article-toolbar {
    --feather-success-color: green;
  }
}

// Dark color mode
.app-nightmode,
.app-sunsetmode,
.app-darkmode {
  & .article-toolbar {
    --feather-success-color: green;
  }
}

.article-toolbar {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  max-width: 100%;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  height: 41px;

  background-color: var(--background-color);

  .article-buttons,
  .site-info {
    background: var(--background-color);
    color: var(--text-color);

    div {
      color: var(--text-color);
    }

    span {
      color: var(--text-color);
    }
    .feather {
      color: var(--text-color);
    }

    .feather-filled {
      fill: var(--text-color);
    }

    .feather-success {
      color: var(--feather-success-color);
    }
  }
}

.article-buttons {
  display: block;
  position: absolute;
  top: 0;
  width: 41%;
  height: 40px;
  z-index: 1;
  background-image: linear-gradient(to right, rgba(255,255,255,0) 0%, #fff 10%);
}

.site-info {
  display: block;
  position: absolute;
  top: 0;
  width: 59%;
  height: 40px;
  z-index: 1;
  background-image: linear-gradient(to right, rgba(255,255,255,0) 0%, #fff 10%);
  left: 0;

  .btn-toolbar {
    width: 100%;
    text-align: left;
  }

  .wrap {
    float: left;
  }
}

.article-buttons {
  right:0 ;

  .wrap {
    float: right;
  }
}

.btn-toolbar {
  color: black;
  display: block !important;
  z-index: 2;
  background: transparent;
  border: none;
  border-radius: 0;
  width: 44px;
  height: 40px;
  padding: 0;
  position: relative;

  &:hover {
    color: black;
  }
  &:focus {
    outline: 0;
    box-shadow: none;
  }
}

.favicon-wrap {
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 0;
}

.dropdown-item span {
  color: #000 !important;
}

.dropdown > .btn-link {
  color: #000;
}

.article-setting {
  z-index: 5;
  position: absolute;
  top: 41px;
  width: 100%;
  height: 49px;
  border-bottom: 1px solid #e9e9e9;
  background-color: #f5f5f7;
  left: 0;
  display: flex;
}

.app-sunsetmode {
  .dropdown-setting {
    select {
      background: var(--background-color);
      border: 0;
    }
  }
  .article-setting {
    background-color: var(--background-color);
    border-color: var(--border-color);
  }

  .settings-wrap {
    border-color: var(--border-color);
  }

  .icon-smaller-text {
    fill: #000;
  }
}

.app-nightmode {
  .dropdown-setting {
    select {
      background: rgba(var(--nightmode-background), 0.8);
      border: 0;
      color: #fff;
    }
  }

  .settings-wrap {
    &:after {
      border-color: #fff transparent transparent transparent;
    }
  }
  .article-setting {
    background-color: var(--background-color);
    border-color: var(--border-color);
  }

  .settings-wrap {
    border-color: var(--border-color);
  }

  .icon-smaller-text {
    fill: #fff;
  }
}

.app-darkmode {
  .dropdown-setting {
    select {
      background: rgba(var(--darkmode-background), 0.8);
      border: 0;
      color: #fff;
    }
  }

  .settings-wrap {
    &:after {
      border-color: #fff transparent transparent transparent;
    }
  }
  .article-setting {
    background-color: var(--background-color);
    border-color: var(--border-color);
  }

  .settings-wrap {
    border-color: var(--border-color);
  }

  .icon-smaller-text {
    fill: #fff;
  }
}

.settings-wrap {
  display: flex;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0;
  color: black;
  font-weight: 700;
  font-size: 18px;
  border-right: 1px solid #e9e9eb;

  select {
    border: 0;
    background: var(--background-color);
    -webkit-appearance: none;
    appearance: none;
    box-shadow: none;

    &:focus {
      box-shadow: none;
    }
  }

  &:after {
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 5px 4px 0 4px;
      border-color: #0D1623 transparent transparent transparent;
      content: "";
      position: absolute;
      left: 130px;
      top: 23px;
      pointer-events: none;
    }
}

.dropdown-setting {
  width: auto;

  select {
    appearance: none;
  }
}

.icon-smaller-text {
    fill: #0D1623;
}

.hidden {
  display: none;
}
</style>
