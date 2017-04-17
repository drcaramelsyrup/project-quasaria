import argparse
import re
import json

parser = argparse.ArgumentParser(description='Bleh')
parser.add_argument('source', help='Source file for conversation (in Entweedle format)')
parser.add_argument('dest', help='Destination file for conversation (in JSON)')
args = parser.parse_args()

source_file = open(args.source, 'r')
source_raw = source_file.read()
source_file.close()

source_nodes = [re.split(r'[\n]+', x) for x in re.split(':: ', source_raw) if len(x) > 0]
conv_title = source_nodes[0][1]
conv_nodes = source_nodes[3:]
conv_dict = {}
main_speaker = ""

titlesToIds = {}

def createConvNode(node, id):
	node_title_split = re.split(r'[\[\]]', node[0])
	node_name = node_title_split[0]
	if len(node_title_split) < 2 or len(node_title_split[1]) == 0:
		speaker = main_speaker
	else:
		speaker = node_title_split[1].replace('_', ' ')
	node_text = ''
	node_responses = []
	comments = []
	actions = {}
	for line in node[1:]:
		if len(line) == 0:
			continue
		if line.startswith("[[") and line.endswith("]]"):
			response = re.split('->', line[2:-2])
			if len(response) == 1:
				node_responses.append({'text': response[0], 'target': response[0]})
			else:
				node_responses.append({'text': response[0], 'target': response[1]})
		elif line.startswith("<!--"):
			comments.append(line)
		elif line.startswith("(set:"):
			action = [x for x in re.split(r'[\$) ]', line) if len(x) > 0]
			action_variable = action[1]
			action_value = action[3]
			actions[action_variable] = action_value
		elif line.startswith("(if:"):
			cond_and_response = re.split(r'\)\[\[\[', line)
			response = cond_and_response[1][:-3]
			conds = [x.strip() for x in re.split(r'and', cond_and_response[0][5:])]
			conditions = {}
			for cond in conds:
				cond = [x for x in re.split(r'[\$) ]', cond) if len(x) > 0]
				cond_var = cond[0]
				if cond[2] == "not":
					cond_val = "!" + cond[3]
				else:
					cond_val = cond[2]
				conditions[cond_var] = cond_val
			response = re.split('->', response)
			if len(response) == 1:
				node_responses.append({'text': response[0], 'target': response[0], 'conditions': conditions})
			else:
				node_responses.append({'text': response[0], 'target': response[1], 'conditions': conditions})
		elif line[0] != '{' and line[0] != '}':
			node_text = node_text + line + '\n'
	node_text = node_text.strip()
	titlesToIds[node_name] = id
	return {
		'id': id,
		'name': node_name,
		'text': node_text,
		'comments': comments,
		'responses': node_responses,
		'actions': actions,
		'speaker': speaker
	}

conv_dict['start'] = createConvNode(conv_nodes[0], 0)
main_speaker = conv_dict['start']['speaker']

for i, node in enumerate(conv_nodes):
	conv_node = createConvNode(node, i)
	conv_dict[conv_node['name']] = conv_node

conv_dict_idx = {}
for node_name in conv_dict:
	node = conv_dict[node_name]
	for response in node['responses']:
		response['target'] = titlesToIds[response['target']]
	del node['name']
	conv_dict_idx[node['id']] = node

with open(args.dest, 'w') as dest_file:
	json.dump(conv_dict_idx, dest_file, sort_keys=True, indent=4, separators=(',', ': '))