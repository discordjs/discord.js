// Discord.jsの必要なクラスをインポート
const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    StringSelectMenuBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    AttachmentBuilder
  } = require('discord.js');
  require('dotenv').config();
  
  // ボットの基本設定
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
  });
  
  // グローバル変数
  const activeRecruitments = new Map(); // 現在進行中の募集を保持
  const attributes = ['火', '水', '土', '風', '光', '闇']; // グラブルの属性
  const raidTypes = ['天元', 'ルシゼロ', '参加者希望']; // レイドタイプ
  const timeOptions = []; // 時間オプション（後で初期化）
  
  // 時間オプションを初期化
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    timeOptions.push({
      label: `${hour}:00`,
      value: `${hour}:00`
    });
    timeOptions.push({
      label: `${hour}:30`,
      value: `${hour}:30`
    });
  }
  
  // ボットの準備完了時に実行
  client.once('ready', () => {
    console.log(`${client.user.tag} でログインしました！`);
    // 毎日の自動締め切りチェッカーを開始
    setInterval(checkAutomaticClosing, 60 * 1000); // 1分ごとにチェック
  });
  
  // メッセージコマンドハンドラ
  client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    // !募集コマンドで募集作成開始
    if (message.content === '!募集') {
      await startRecruitment(message);
    }
  });
  
  // インタラクションハンドラ
  client.on('interactionCreate', async interaction => {
    try {
      if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
      } else if (interaction.isStringSelectMenu()) {
        await handleSelectMenuInteraction(interaction);
      }
    } catch (error) {
      console.error('インタラクション処理エラー:', error);
      try {
        const errorMsg = 'エラーが発生しました。しばらく経ってからやり直してください。';
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: errorMsg, ephemeral: true });
        } else {
          await interaction.reply({ content: errorMsg, ephemeral: true });
        }
      } catch (e) {
        console.error('エラーレスポンス送信失敗:', e);
      }
    }
  });
  
  // 募集開始処理
  async function startRecruitment(message) {
    // レイドタイプ選択ボタン
    const row = new ActionRowBuilder()
      .addComponents(
        ...raidTypes.map(type => 
          new ButtonBuilder()
            .setCustomId(`raid_type_${type}`)
            .setLabel(type)
            .setStyle(ButtonStyle.Primary)
        )
      );
    
    const embed = new EmbedBuilder()
      .setTitle('🔰 高難易度募集作成')
      .setDescription('募集するレイドタイプを選択してください。')
      .setColor('#0099ff');
    
    const response = await message.reply({
      embeds: [embed],
      components: [row]
    });
    
    // 30分後に自動的にボタンを無効化
    setTimeout(() => {
      const disabledRow = new ActionRowBuilder()
        .addComponents(
          ...raidTypes.map(type => 
            new ButtonBuilder()
              .setCustomId(`raid_type_${type}`)
              .setLabel(type)
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          )
        );
      
      response.edit({
        embeds: [embed.setDescription('この募集作成セッションは期限切れになりました。新しく募集を開始するには `!募集` コマンドを使用してください。')],
        components: [disabledRow]
      }).catch(console.error);
    }, 30 * 60 * 1000); // 30分後
  }
  
  // ボタンインタラクション処理
  async function handleButtonInteraction(interaction) {
    const customId = interaction.customId;
    
    // レイドタイプ選択
    if (customId.startsWith('raid_type_')) {
      const raidType = customId.replace('raid_type_', '');
      await showDateSelection(interaction, raidType);
    }
    // 日付選択
    else if (customId.startsWith('date_')) {
      const [_, action, raidType, dateStr] = customId.split('_');
      
      if (action === 'select') {
        // 日付選択後の時間選択画面表示
        await showTimeSelection(interaction, raidType, dateStr);
      }
    }
    // 募集確定ボタン
    else if (customId.startsWith('confirm_recruitment_')) {
      const recruitmentId = customId.replace('confirm_recruitment_', '');
      await finalizeRecruitment(interaction, recruitmentId);
    }
    // 募集キャンセルボタン
    else if (customId === 'cancel_recruitment') {
      await interaction.update({
        content: '募集作成をキャンセルしました。',
        embeds: [],
        components: []
      });
    }
    // 参加申込ボタン
    else if (customId.startsWith('join_recruitment_')) {
      const recruitmentId = customId.replace('join_recruitment_', '');
      await showJoinOptions(interaction, recruitmentId);
    }
    // 参加キャンセルボタン
    else if (customId.startsWith('cancel_participation_')) {
      const recruitmentId = customId.replace('cancel_participation_', '');
      await cancelParticipation(interaction, recruitmentId);
    }
    // 募集締め切りボタン
    else if (customId.startsWith('close_recruitment_')) {
      const recruitmentId = customId.replace('close_recruitment_', '');
      await closeRecruitment(interaction, recruitmentId);
    }
    // 参加確定ボタン
    else if (customId.startsWith('confirm_join_')) {
      const [_, __, recruitmentId, joinType, attributesStr, timeAvailability] = customId.split('_');
      const selectedAttributes = attributesStr.split(',');
      await confirmParticipation(interaction, recruitmentId, joinType, selectedAttributes, timeAvailability);
    }
    // 参加申込キャンセルボタン
    else if (customId === 'cancel_join') {
      await interaction.update({
        content: '参加申込をキャンセルしました。',
        embeds: [],
        components: []
      });
    }
  }
  
  // セレクトメニュー処理
  async function handleSelectMenuInteraction(interaction) {
    const customId = interaction.customId;
    
    // 時間選択
    if (customId.startsWith('time_select_')) {
      const [_, __, raidType, date] = customId.split('_');
      const selectedTime = interaction.values[0];
      await confirmRecruitment(interaction, raidType, date, selectedTime);
    }
    // 参加タイプ選択（天元/ルシゼロ/なんでも）
    else if (customId.startsWith('join_type_select_')) {
      const recruitmentId = customId.replace('join_type_select_', '');
      const selectedType = interaction.values[0];
      await showAttributeSelection(interaction, recruitmentId, selectedType);
    }
    // 属性選択
    else if (customId.startsWith('attribute_select_')) {
      const [_, __, recruitmentId, joinType] = customId.split('_');
      const selectedAttributes = interaction.values;
      await showTimeAvailabilitySelection(interaction, recruitmentId, joinType, selectedAttributes);
    }
    // 参加可能時間選択
    else if (customId.startsWith('time_availability_')) {
      const [_, __, recruitmentId, joinType, attributesStr] = customId.split('_');
      const selectedTime = interaction.values[0];
      const selectedAttributes = attributesStr.split(',');
      
      await showJoinConfirmation(
        interaction, 
        recruitmentId, 
        joinType, 
        selectedAttributes, 
        selectedTime
      );
    }
  }
  
  // 日付選択UI表示
  async function showDateSelection(interaction, raidType) {
    // 今日から7日分の日付ボタンを作成
    const dateButtons = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;
      
      dateButtons.push(
        new ButtonBuilder()
          .setCustomId(`date_select_${raidType}_${dateString}`)
          .setLabel(displayDate)
          .setStyle(ButtonStyle.Secondary)
      );
    }
    
    // ボタンを行に分ける（1行に最大5つまで）
    const rows = [];
    for (let i = 0; i < dateButtons.length; i += 5) {
      const row = new ActionRowBuilder()
        .addComponents(dateButtons.slice(i, Math.min(i + 5, dateButtons.length)));
      rows.push(row);
    }
    
    const embed = new EmbedBuilder()
      .setTitle(`📅 ${raidType}募集 - 日付選択`)
      .setDescription('開催したい日付を選択してください。')
      .setColor('#0099ff');
    
    await interaction.update({
      embeds: [embed],
      components: rows
    });
  }
  
  // 時間選択UI表示
  async function showTimeSelection(interaction, raidType, date) {
    // 時間選択用セレクトメニュー
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`time_select_${raidType}_${date}`)
          .setPlaceholder('開催時間を選択してください')
          .addOptions(timeOptions)
      );
    
    const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const embed = new EmbedBuilder()
      .setTitle(`⏰ ${raidType}募集 - 時間選択`)
      .setDescription(`選択した日付: ${formattedDate}\n開催時間を選択してください。`)
      .setColor('#0099ff');
    
    await interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
  
  // 募集確認UI表示
  async function confirmRecruitment(interaction, raidType, date, time) {
    const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const recruitmentId = `${Date.now()}_${interaction.user.id}`;
    
    const embed = new EmbedBuilder()
      .setTitle('🔍 募集内容確認')
      .setDescription('以下の内容で募集を開始します。よろしければ「確定」ボタンを押してください。')
      .setColor('#0099ff')
      .addFields(
        { name: 'レイドタイプ', value: raidType, inline: true },
        { name: '開催日', value: formattedDate, inline: true },
        { name: '開催時間', value: time, inline: true },
        { name: '募集者', value: interaction.user.toString(), inline: true }
      );
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`confirm_recruitment_${recruitmentId}`)
          .setLabel('確定')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('cancel_recruitment')
          .setLabel('キャンセル')
          .setStyle(ButtonStyle.Danger)
      );
    
    // 一時データを保存
    const recruitmentData = {
      id: recruitmentId,
      type: raidType,
      date: date,
      time: time,
      creator: interaction.user.id,
      participants: [],
      status: 'pending',
      channel: interaction.channelId,
      messageId: null
    };
    
    activeRecruitments.set(recruitmentId, recruitmentData);
    
    await interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
  
  // 募集確定処理
  async function finalizeRecruitment(interaction, recruitmentId) {
    const recruitment = activeRecruitments.get(recruitmentId);
    if (!recruitment) {
      return await interaction.update({
        content: 'エラー: 募集データが見つかりません。',
        embeds: [],
        components: []
      });
    }
    
    recruitment.status = 'active';
    
    const formattedDate = new Date(recruitment.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const embed = new EmbedBuilder()
      .setTitle(`📢 【募集】${recruitment.type} - ${formattedDate} ${recruitment.time}`)
      .setDescription(`募集者: <@${recruitment.creator}>\n\n参加希望の方は下のボタンから申し込んでください。`)
      .setColor('#0099ff')
      .addFields(
        ...attributes.map(attr => {
          return { name: `【${attr}】`, value: '未定', inline: true };
        })
      )
      .setFooter({ text: `募集ID: ${recruitmentId} | 開催日の朝
        // 募集確定処理（続き）
async function finalizeRecruitment(interaction, recruitmentId) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment) {
    return await interaction.update({
      content: 'エラー: 募集データが見つかりません。',
      embeds: [],
      components: []
    });
  }
  
  recruitment.status = 'active';
  
  const formattedDate = new Date(recruitment.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const embed = new EmbedBuilder()
    .setTitle(`📢 【募集】${recruitment.type} - ${formattedDate} ${recruitment.time}`)
    .setDescription(`募集者: <@${recruitment.creator}>\n\n参加希望の方は下のボタンから申し込んでください。`)
    .setColor('#0099ff')
    .addFields(
      ...attributes.map(attr => {
        return { name: `【${attr}】`, value: '未定', inline: true };
      })
    )
    .setFooter({ text: `募集ID: ${recruitmentId} | 開催日の朝8時に自動締め切り` });
  
  const joinRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`join_recruitment_${recruitmentId}`)
        .setLabel('参加申込')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`cancel_participation_${recruitmentId}`)
        .setLabel('参加キャンセル')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`close_recruitment_${recruitmentId}`)
        .setLabel('募集締め切り')
        .setStyle(ButtonStyle.Danger)
    );
  
  const message = await interaction.update({
    content: '募集を作成しました！',
    embeds: [embed],
    components: [joinRow]
  });
  
  recruitment.messageId = interaction.message.id;
  activeRecruitments.set(recruitmentId, recruitment);
}

// 参加オプション表示
async function showJoinOptions(interaction, recruitmentId) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment || recruitment.status !== 'active') {
    return await interaction.reply({
      content: 'この募集は既に終了しているか、存在しません。',
      ephemeral: true
    });
  }
  
  // すでに参加している場合
  const existingParticipation = recruitment.participants.find(p => p.userId === interaction.user.id);
  if (existingParticipation) {
    return await interaction.reply({
      content: `あなたはすでにこの募集に参加しています。\n選択した属性: ${existingParticipation.attributes.join(', ')}\n参加可能時間: ${existingParticipation.timeAvailability}\nキャンセルする場合は「参加キャンセル」ボタンを押してください。`,
      ephemeral: true
    });
  }
  
  const formattedDate = new Date(recruitment.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let selectOptions = [];
  
  // 募集タイプに応じた参加オプションを設定
  if (recruitment.type === '参加者希望') {
    selectOptions = [
      { label: '天元', value: '天元', description: '天元の戦闘に参加希望' },
      { label: 'ルシゼロ', value: 'ルシゼロ', description: 'ルシファーHL、ゼロ討滅戦に参加希望' },
      { label: 'なんでも可', value: 'なんでも可', description: 'どちらでも参加可能' }
    ];
  } else {
    // 天元またはルシゼロ募集の場合は自動的にそのタイプに設定
    selectOptions = [
      { label: recruitment.type, value: recruitment.type, description: `${recruitment.type}の戦闘に参加` }
    ];
  }
  
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`join_type_select_${recruitmentId}`)
        .setPlaceholder('参加タイプを選択してください')
        .addOptions(selectOptions)
    );
  
  const embed = new EmbedBuilder()
    .setTitle('🎮 参加申込')
    .setDescription(`【${recruitment.type}】${formattedDate} ${recruitment.time}\n\n参加タイプを選択してください。`)
    .setColor('#00cc99');
  
  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true
  });
}

// 属性選択UI表示
async function showAttributeSelection(interaction, recruitmentId, joinType) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment || recruitment.status !== 'active') {
    return await interaction.update({
      content: 'この募集は既に終了しているか、存在しません。',
      embeds: [],
      components: []
    });
  }
  
  const attributeOptions = attributes.map(attr => {
    return {
      label: attr,
      value: attr,
      description: `${attr}属性で参加`
    };
  });
  
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`attribute_select_${recruitmentId}_${joinType}`)
        .setPlaceholder('参加可能な属性を選択してください（複数選択可）')
        .setMinValues(1)
        .setMaxValues(attributes.length)
        .addOptions(attributeOptions)
    );
  
  const embed = new EmbedBuilder()
    .setTitle('🔮 属性選択')
    .setDescription(`参加タイプ: ${joinType}\n\n参加可能な属性を選択してください（複数選択可）。`)
    .setColor('#00cc99');
  
  await interaction.update({
    embeds: [embed],
    components: [row]
  });
}

// 参加可能時間選択UI表示
async function showTimeAvailabilitySelection(interaction, recruitmentId, joinType, selectedAttributes) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment || recruitment.status !== 'active') {
    return await interaction.update({
      content: 'この募集は既に終了しているか、存在しません。',
      embeds: [],
      components: []
    });
  }
  
  // 募集時間を基準に、30分刻みの選択肢を作成
  const recruitmentTime = recruitment.time;
  const [recruitHour, recruitMinute] = recruitmentTime.split(':').map(num => parseInt(num));
  
  // 募集時間当日の選択肢を作成
  const timeAvailabilityOptions = [];
  for (let h = recruitHour; h < 24; h++) {
    for (let m of [0, 30]) {
      // 募集時間より前の時間はスキップ
      if (h === recruitHour && m < recruitMinute) continue;
      
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      timeAvailabilityOptions.push({
        label: `${hour}:${minute}`,
        value: `${hour}:${minute}`,
        description: `${hour}:${minute}から参加可能`
      });
    }
  }
  
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`time_availability_${recruitmentId}_${joinType}_${selectedAttributes.join(',')}`)
        .setPlaceholder('参加可能な最も早い時間を選択してください')
        .addOptions(timeAvailabilityOptions)
    );
  
  const embed = new EmbedBuilder()
    .setTitle('⏰ 参加可能時間')
    .setDescription(`参加タイプ: ${joinType}\n選択した属性: ${selectedAttributes.join(', ')}\n\n参加可能な最も早い時間を選択してください。`)
    .setColor('#00cc99');
  
  await interaction.update({
    embeds: [embed],
    components: [row]
  });
}

// 参加確認UI表示
async function showJoinConfirmation(interaction, recruitmentId, joinType, selectedAttributes, timeAvailability) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment || recruitment.status !== 'active') {
    return await interaction.update({
      content: 'この募集は既に終了しているか、存在しません。',
      embeds: [],
      components: []
    });
  }
  
  const embed = new EmbedBuilder()
    .setTitle('✅ 参加申込確認')
    .setDescription('以下の内容で参加申込を確定します。')
    .setColor('#00cc99')
    .addFields(
      { name: '参加タイプ', value: joinType, inline: true },
      { name: '参加可能属性', value: selectedAttributes.join(', '), inline: true },
      { name: '参加可能時間', value: timeAvailability, inline: true }
    );
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`confirm_join_${recruitmentId}_${joinType}_${selectedAttributes.join(',')}_${timeAvailability}`)
        .setLabel('参加確定')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('cancel_join')
        .setLabel('キャンセル')
        .setStyle(ButtonStyle.Danger)
    );
  
  await interaction.update({
    embeds: [embed],
    components: [row]
  });
}

// 参加確定処理
async function confirmParticipation(interaction, recruitmentId, joinType, selectedAttributes, timeAvailability) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment || recruitment.status !== 'active') {
    return await interaction.update({
      content: 'この募集は既に終了しているか、存在しません。',
      embeds: [],
      components: []
    });
  }
  
  // すでに参加している場合は情報を更新
  const existingIndex = recruitment.participants.findIndex(p => p.userId === interaction.user.id);
  
  const participantData = {
    userId: interaction.user.id,
    username: interaction.user.username,
    joinType: joinType,
    attributes: selectedAttributes,
    timeAvailability: timeAvailability,
    assignedAttribute: null // 割り当ては後で行う
  };
  
  if (existingIndex >= 0) {
    recruitment.participants[existingIndex] = participantData;
  } else {
    recruitment.participants.push(participantData);
  }
  
  // 募集メッセージの更新
  await updateRecruitmentMessage(recruitment);
  
  // 参加者が7人以上の場合、自動割り振りを行う
  if (recruitment.participants.length >= 7 && recruitment.status === 'active') {
    await autoAssignAttributes(recruitment);
  }
  
  await interaction.update({
    content: '参加申込が完了しました！',
    embeds: [],
    components: []
  });
}

// 参加キャンセル処理
async function cancelParticipation(interaction, recruitmentId) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment) {
    return await interaction.reply({
      content: 'この募集は存在しません。',
      ephemeral: true
    });
  }
  
  const participantIndex = recruitment.participants.findIndex(p => p.userId === interaction.user.id);
  
  if (participantIndex === -1) {
    return await interaction.reply({
      content: 'あなたはこの募集に参加していません。',
      ephemeral: true
    });
  }
  
  // 参加者リストから削除
  recruitment.participants.splice(participantIndex, 1);
  
  // 割り振りが行われていた場合、再割り振り
  if (recruitment.status === 'assigned') {
    await autoAssignAttributes(recruitment);
  }
  
  // 募集メッセージの更新
  await updateRecruitmentMessage(recruitment);
  
  await interaction.reply({
    content: '参加をキャンセルしました。',
    ephemeral: true
  });
}

// 募集締め切り処理
async function closeRecruitment(interaction, recruitmentId) {
  const recruitment = activeRecruitments.get(recruitmentId);
  if (!recruitment) {
    return await interaction.reply({
      content: 'この募集は存在しません。',
      ephemeral: true
    });
  }
  
  // 募集者以外は締め切れないようにする
  if (interaction.user.id !== recruitment.creator) {
    return await interaction.reply({
      content: '募集者のみが募集を締め切ることができます。',
      ephemeral: true
    });
  }
  
  recruitment.status = 'closed';
  
  // 属性の自動割り振りを実行
  await autoAssignAttributes(recruitment);
  
  // 募集メッセージの更新
  await updateRecruitmentMessage(recruitment);
  
  await interaction.reply({
    content: '募集を締め切り、属性の割り振りを行いました。',
    ephemeral: true
  });
}

// 募集メッセージ更新処理
async function updateRecruitmentMessage(recruitment) {
  try {
    const channel = await client.channels.fetch(recruitment.channel);
    if (!channel) return;
    
    const message = await channel.messages.fetch(recruitment.messageId);
    if (!message) return;
    
    const formattedDate = new Date(recruitment.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // 参加者情報を集計
    const participantsByAttribute = {};
    attributes.forEach(attr => {
      participantsByAttribute[attr] = [];
    });
    
    // 参加者を属性ごとに分類
    recruitment.participants.forEach(participant => {
      participant.attributes.forEach(attr => {
        if (!participantsByAttribute[attr].includes(participant)) {
          participantsByAttribute[attr].push(participant);
        }
      });
// 募集メッセージ更新処理（続き）
async function updateRecruitmentMessage(recruitment) {
  try {
    const channel = await client.channels.fetch(recruitment.channel);
    if (!channel) return;
    
    const message = await channel.messages.fetch(recruitment.messageId);
    if (!message) return;
    
    const formattedDate = new Date(recruitment.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // 参加者情報を集計
    const participantsByAttribute = {};
    attributes.forEach(attr => {
      participantsByAttribute[attr] = [];
    });
    
    // 参加者を属性ごとに分類
    recruitment.participants.forEach(participant => {
      participant.attributes.forEach(attr => {
        if (!participantsByAttribute[attr].includes(participant)) {
          participantsByAttribute[attr].push(participant);
        }
      });
    });
    
    let description = `募集者: <@${recruitment.creator}>\n\n`;
    
    // 募集ステータスに応じた表示
    if (recruitment.status === 'active') {
      description += '🟢 **募集中**\n参加希望の方は下のボタンから申し込んでください。\n\n';
    } else if (recruitment.status === 'closed' || recruitment.status === 'assigned') {
      description += '🔴 **募集終了**\n以下の通り参加者を割り振りました。\n\n';
    }
    
    // 参加者の詳細リスト（募集中の場合）
    if (recruitment.status === 'active' && recruitment.participants.length > 0) {
      description += '**【参加表明者】**\n';
      const participantsByTime = {};
      
      recruitment.participants.forEach(p => {
        if (!participantsByTime[p.timeAvailability]) {
          participantsByTime[p.timeAvailability] = [];
        }
        participantsByTime[p.timeAvailability].push(p);
      });
      
      // 時間帯ごとに表示
      Object.keys(participantsByTime).sort().forEach(time => {
        description += `⏰ **${time}〜** (${participantsByTime[time].length}名)\n`;
        participantsByTime[time].forEach(p => {
          description += `- <@${p.userId}> [${p.joinType}] ${p.attributes.join('/')}\n`;
        });
        description += '\n';
      });
    }
    
    // エンベッド作成
    const embed = new EmbedBuilder()
      .setTitle(`${recruitment.status === 'active' ? '📢' : '🏁'} 【${recruitment.type}】${formattedDate} ${recruitment.time}`)
      .setDescription(description)
      .setColor(recruitment.status === 'active' ? '#0099ff' : '#ff6666');
    
    // 各属性のフィールドを設定
    const fields = [];
    attributes.forEach(attr => {
      let value = '未定';
      
      // 割り振り済みの場合
      if (recruitment.status === 'closed' || recruitment.status === 'assigned') {
        const assignedParticipant = recruitment.participants.find(p => p.assignedAttribute === attr);
        if (assignedParticipant) {
          value = `<@${assignedParticipant.userId}>`;
        }
      } else {
        // 募集中の場合は各属性の希望者数を表示
        const count = participantsByAttribute[attr].length;
        value = count > 0 ? `${count}名が希望` : '未定';
      }
      
      fields.push({ name: `【${attr}】`, value: value, inline: true });
    });
    
    embed.addFields(fields);
    embed.setFooter({ text: `募集ID: ${recruitment.id} | ${recruitment.status === 'active' ? '開催日の朝8時に自動締め切り' : '募集終了'}` });
    
    // ボタン行を作成（募集中の場合のみ有効）
    const joinRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`join_recruitment_${recruitment.id}`)
          .setLabel('参加申込')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(recruitment.status !== 'active'),
        new ButtonBuilder()
          .setCustomId(`cancel_participation_${recruitment.id}`)
          .setLabel('参加キャンセル')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(recruitment.status !== 'active'),
        new ButtonBuilder()
          .setCustomId(`close_recruitment_${recruitment.id}`)
          .setLabel('募集締め切り')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(recruitment.status !== 'active' || recruitment.creator !== message.author.id)
      );
    
    // メッセージを更新
    await message.edit({
      content: recruitment.status === 'active' ? '**【募集中】**' : '**【募集終了】**',
      embeds: [embed],
      components: [joinRow]
    });
  } catch (error) {
    console.error('募集メッセージ更新エラー:', error);
  }
}

// 属性自動割り振り処理
async function autoAssignAttributes(recruitment) {
  // 割り振りが必要ない場合
  if (recruitment.participants.length === 0) {
    return;
  }
  
  recruitment.status = 'assigned';
  
  // 時間帯ごとに参加者をグループ化
  const participantsByTime = {};
  recruitment.participants.forEach(p => {
    if (!participantsByTime[p.timeAvailability]) {
      participantsByTime[p.timeAvailability] = [];
    }
    participantsByTime[p.timeAvailability].push({...p});
  });
  
  // 各時間帯の参加者に対して属性割り振りを実行
  const timeSlots = Object.keys(participantsByTime).sort();
  
  // 最適な時間帯を見つける（参加者が最も多い時間帯）
  let bestTimeSlot = timeSlots[0];
  let maxParticipants = 0;
  
  timeSlots.forEach(timeSlot => {
    // 参加タイプによるフィルタリング
    const filteredParticipants = participantsByTime[timeSlot].filter(p => {
      if (recruitment.type === '天元') {
        return p.joinType === '天元' || p.joinType === 'なんでも可';
      } else if (recruitment.type === 'ルシゼロ') {
        return p.joinType === 'ルシゼロ' || p.joinType === 'なんでも可';
      } else {
        // 参加者希望の場合は全員対象
        return true;
      }
    });
    
    if (filteredParticipants.length > maxParticipants) {
      maxParticipants = filteredParticipants.length;
      bestTimeSlot = timeSlot;
    }
  });
  
  // 一番参加者が多い時間帯のレイドタイプを決定（参加者希望の場合のみ）
  let raidTypeToAssign = recruitment.type;
  if (recruitment.type === '参加者希望') {
    const participantsInBestTimeSlot = participantsByTime[bestTimeSlot];
    
    let tengenCount = 0;
    let luciZeroCount = 0;
    
    participantsInBestTimeSlot.forEach(p => {
      if (p.joinType === '天元') tengenCount++;
      else if (p.joinType === 'ルシゼロ') luciZeroCount++;
    });
    
    raidTypeToAssign = tengenCount > luciZeroCount ? '天元' : 'ルシゼロ';
  }
  
  // 選択された時間帯とレイドタイプに基づいて参加者をフィルタリング
  const eligibleParticipants = participantsByTime[bestTimeSlot].filter(p => {
    if (raidTypeToAssign === '天元') {
      return p.joinType === '天元' || p.joinType === 'なんでも可';
    } else {
      return p.joinType === 'ルシゼロ' || p.joinType === 'なんでも可';
    }
  });
  
  // 属性の割り振り処理
  const assignments = {};
  attributes.forEach(attr => {
    assignments[attr] = null;
  });
  
  // 優先順位付け：
  // 1. 特定の属性だけを選択している人を優先
  // 2. 選択属性数が少ない人を優先
  
  // 参加者を属性選択数で並べ替え
  eligibleParticipants.sort((a, b) => a.attributes.length - b.attributes.length);
  
  // 各参加者について、選択した属性のうち最も希望者が少ない属性に割り当て
  for (const participant of eligibleParticipants) {
    // この参加者が選択した属性で、まだ割り当てられていないものを探す
    const availableAttributes = participant.attributes.filter(attr => !assignments[attr]);
    
    if (availableAttributes.length > 0) {
      // 利用可能な属性から一つ選択
      const chosenAttribute = availableAttributes[0];
      assignments[chosenAttribute] = participant;
      participant.assignedAttribute = chosenAttribute;
    }
  }
  
  // 埋まっていない属性を、まだ割り当てられていない参加者で埋める
  const unassignedParticipants = eligibleParticipants.filter(p => !p.assignedAttribute);
  const emptyAttributes = attributes.filter(attr => !assignments[attr]);
  
  for (let i = 0; i < Math.min(unassignedParticipants.length, emptyAttributes.length); i++) {
    const participant = unassignedParticipants[i];
    const attr = emptyAttributes[i];
    
    // 参加者の希望属性に含まれていない場合でも割り当て
    assignments[attr] = participant;
    participant.assignedAttribute = attr;
  }
  
  // 割り当て結果を元の参加者リストに反映
  for (const participant of recruitment.participants) {
    const assignedParticipant = eligibleParticipants.find(p => p.userId === participant.userId);
    if (assignedParticipant && assignedParticipant.assignedAttribute) {
      participant.assignedAttribute = assignedParticipant.assignedAttribute;
    } else {
      participant.assignedAttribute = null;
    }
  }
  
  // 時間とレイドタイプを更新
  recruitment.finalTime = bestTimeSlot;
  recruitment.finalRaidType = raidTypeToAssign;
  
  return recruitment;
}

// 自動締め切りチェック
function checkAutomaticClosing() {
  const now = new Date();
  
  activeRecruitments.forEach(async (recruitment, id) => {
    if (recruitment.status !== 'active') return;
    
    const raidDate = new Date(recruitment.date);
    raidDate.setHours(8, 0, 0, 0); // 開催日の朝8時
    
    // 開催日の朝8時を過ぎている場合、自動締め切り
    if (now >= raidDate) {
      recruitment.status = 'closed';
      await autoAssignAttributes(recruitment);
      await updateRecruitmentMessage(recruitment);
      
      // 終了メッセージを送信
      try {
        const channel = await client.channels.fetch(recruitment.channel);
        if (channel) {
          await channel.send({
            content: `<@${recruitment.creator}> **【自動締め切り】** ${recruitment.type}募集が締め切られ、参加者が割り振られました。`
          });
        }
      } catch (error) {
        console.error('自動締め切りメッセージ送信エラー:', error);
      }
    }
  });
}

// Botログイン
client.login(process.env.TOKEN);

// 募集管理機能（続き）

// 現在募集中のリストを表示する機能
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  if (message.content === '!募集リスト') {
    await showActiveRecruitments(message);
  }
});

// 募集リスト表示機能
async function showActiveRecruitments(message) {
  const activeList = Array.from(activeRecruitments.values())
    .filter(r => r.status === 'active');
  
  if (activeList.length === 0) {
    return message.reply('現在募集中の高難易度レイドはありません。');
  }
  
  const embed = new EmbedBuilder()
    .setTitle('🔍 現在募集中のレイド一覧')
    .setDescription('参加するには該当の募集メッセージで「参加申込」ボタンを押してください。')
    .setColor('#0099ff');
  
  // 募集情報を整理
  activeList.forEach((recruitment, index) => {
    const formattedDate = new Date(recruitment.date).toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric'
    });
    
    const participantCount = recruitment.participants.length;
    
    embed.addFields({
      name: `${index + 1}. ${recruitment.type} - ${formattedDate} ${recruitment.time}`,
      value: `募集者: <@${recruitment.creator}>\n参加者数: ${participantCount}名\n[募集ページへジャンプ](https://discord.com/channels/${message.guildId}/${recruitment.channel}/${recruitment.messageId})`
    });
  });
  
  await message.reply({ embeds: [embed] });
}

// 募集削除コマンド
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  if (message.content.startsWith('!募集削除 ')) {
    const recruitmentId = message.content.replace('!募集削除 ', '');
    await deleteRecruitment(message, recruitmentId);
  }
});

// 募集削除処理
async function deleteRecruitment(message, recruitmentId) {
  const recruitment = activeRecruitments.get(recruitmentId);
  
  if (!recruitment) {
    return message.reply('指定された募集IDは存在しません。');
  }
  
  // 募集者またはサーバー管理者のみ削除可能
  if (recruitment.creator !== message.author.id && !message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply('募集者またはサーバー管理者のみが募集を削除できます。');
  }
  
  try {
    // 募集メッセージを更新
    const channel = await client.channels.fetch(recruitment.channel);
    if (channel) {
      const recruitMessage = await channel.messages.fetch(recruitment.messageId);
      if (recruitMessage) {
        await recruitMessage.edit({
          content: '**【募集削除】** この募集は削除されました。',
          embeds: [],
          components: []
        });
      }
    }
    
    // 募集データを削除
    activeRecruitments.delete(recruitmentId);
    
    await message.reply(`募集ID: ${recruitmentId} の募集を削除しました。`);
  } catch (error) {
    console.error('募集削除エラー:', error);
    await message.reply('募集の削除中にエラーが発生しました。');
  }
}

// ヘルプ表示
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  if (message.content === '!募集ヘルプ') {
    await showHelp(message);
  }
});

// ヘルプ表示機能
async function showHelp(message) {
  const embed = new EmbedBuilder()
    .setTitle('📚 グラブル高難易度募集Bot ヘルプ')
    .setDescription('グランブルーファンタジーの高難易度レイド（天元/ルシゼロ）募集を簡単に行うためのボットです。')
    .setColor('#00cc99')
    .addFields(
      { 
        name: '基本コマンド', 
        value: '`!募集` - 新しいレイド募集を開始します\n`!募集リスト` - 現在進行中の募集一覧を表示します\n`!募集ヘルプ` - このヘルプを表示します'
      },
      {
        name: '募集作成の流れ',
        value: '1. `!募集` コマンドを入力\n2. レイドタイプを選択（天元/ルシゼロ/参加者希望）\n3. 開催日を選択\n4. 開催時間を選択\n5. 内容を確認して「確定」ボタンをクリック'
      },
      {
        name: '参加申込の流れ',
        value: '1. 募集メッセージの「参加申込」ボタンをクリック\n2. 参加タイプを選択（参加者希望の場合のみ）\n3. 参加可能な属性を選択（複数選択可能）\n4. 参加可能な最も早い時間を選択\n5. 内容を確認して「参加確定」ボタンをクリック'
      },
      {
        name: '属性割り振りについて',
        value: '- 7人以上の参加表明があった場合、自動的に割り振りが行われます\n- 開催日の朝8時に自動的に締め切られ、割り振りが確定します\n- 募集者は「募集締め切り」ボタンで手動締め切りも可能です\n- 特定の属性のみを選んだ人が優先されます\n- 複数の属性を選んだ人はバランスよく割り振られます'
      },
      {
        name: '管理コマンド',
        value: '`!募集削除 [募集ID]` - 指定した募集を削除します（募集者または管理者のみ）'
      }
    )
    .setFooter({ text: 'ボタン操作だけで簡単に募集・参加ができます！' });
  
  await message.reply({ embeds: [embed] });
}

// エラーハンドリング
process.on('unhandledRejection', error => {
  console.error('未処理の Promise rejection:', error);
});

// Botログイン
client.login(process.env.TOKEN);
